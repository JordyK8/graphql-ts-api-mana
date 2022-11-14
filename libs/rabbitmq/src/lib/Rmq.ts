import amqp, { Message, Options } from "amqplib";
import { logging as logger } from "@my-foods2/logging";
import { ExchangeObject, QueueObject } from "@my-foods2/interfaces"

export class Amqp {
    private workerChannel: amqp.Channel | null;
    private channel: amqp.Channel | null;
    private pubChannel: amqp.Channel | null;
    private exchange: ExchangeObject;
    private offlinePubQueue: any;
    private queue: QueueObject;
    private connection: amqp.Connection | null;
    private type: "worker" | "publisher" | "both";
    private handler: ((msg: Message, cb: any) => void) | undefined;

    constructor(exchange: ExchangeObject, queue: QueueObject, type: "worker" | "publisher" | "both", handler?: (msg: Message, cb: any) => void) {
        this.channel = null;
        this.pubChannel = null;
        this.workerChannel = null;
        this.offlinePubQueue = [];
        this.connection = null;
        this.queue = queue;
        this.exchange = exchange;
        this.type = type;
        this.handler = handler;
    }
    async init() {        
        this.connection = await amqp.connect("amqp://admin:password@localhost" + "?heartbeat=60");
        
        if (!this.connection) throw new Error("NO_AMQP_CONNECTION")
        this.connection.on("error", (err) => {
            if (err.message !== "Connection closing")
                logger.error(`[AMQP] conn error ${err.message}`);
                // reconnect!!
        });
    
        this.connection.on("close", () => {
            logger.error("[AMQP] reconnecting");
            return setTimeout(this.init.bind(this), 1000);
        });
    
        logger.info("[AMQP] connected");
        await this.whenConnected();
    }
    async whenConnected() {
        await this.createExchangeAndQueue();
        if (["worker", "both"].includes(this.type) && this.handler) await this.startWorker(this.queue.name, this.handler);
        if (["publisher", "both"].includes(this.type)) await this.startPublisher(this.queue.name, this.exchange.name);
    }

    private async createExchangeAndQueue() {
        if (!this.connection) throw new Error("No connection when creating exchanges");
        this.channel = await this.connection.createConfirmChannel()
        if (!this.channel) throw new Error("No channel open when creating exchanges");
        
        // Create dlx exchange
        await this.channel.assertExchange("dlx", "topic", { autoDelete: false, durable: true });
        
        // Create dlx queue
        await this.channel.assertQueue("cmd-dlx-queue", { durable: true });
        
        // Bind dlx x and q
        await this.channel.bindQueue("cmd-dlx-queue", "dlx", "dlx.#");

        // try reconnecting on no connection and do this a few times then only throw error;
        // exchange example : {name: 'test-exchange', type: "x-delayed-message", options: { autoDetele: false, durable:true, arguments: { "x-delayed-type": "direct"}}}
        const ex = await this.channel.assertExchange(this.exchange.name, this.exchange.type, this.exchange.options)
        // Create queue
        // queue example : {name: 'test-q', options: { durable: true }
        const q = await this.channel.assertQueue(this.queue.name, this.queue.options)

        // Bind queue to exchange
        await this.channel.bindQueue(q.queue, ex.exchange, q.queue);
    }

    async startPublisher(queue: string, exchange: string) {
        if(!this.connection) throw new Error("No connection")
        this.pubChannel = await this.connection.createConfirmChannel()
        this.pubChannel.on("error", (err) => {
            if (this.closeOnErr(err)) return;
            logger.error(`[AMQP] channel error ${err.message}`);
        });
    
        this.pubChannel.on("close", function () {
            logger.info("[AMQP] channel closed");
        });
        
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const m = this.offlinePubQueue.shift();
            if (!m) break;
            this.publish(m[0], m[1], m[2], m[3], 3);
        }
    }
    publish(exchange: string, routingKey: string, content: any, options: Options.Publish, maxDelayRetries = 0) {
        options.headers = { maxDelayRetries, died: 0 };
        try {
            if (!this.pubChannel) throw new Error("NO CHANNEL")
            const published = this.pubChannel.publish(exchange, routingKey, content, options);
            if (!published) {
                logger.error("[AMQP] publish failed");
                // Push task to DB or Redis but check error first
                this.offlinePubQueue.push([exchange, routingKey, content, options]);
                this.pubChannel.close();
            }
        } catch (e: any) {
            logger.error(`[AMQP] failed ${e.message}`);
            // Push task to DB or Redis But check error first
            this.offlinePubQueue.push([exchange, routingKey, content, options]);
        }
    }
    
    publishWithDelay(msg: Message, delay: number) {
        const defaultDelay = [{ value: 30000, label:"30s"},{ value: 30000, label:"1min"},{ value: 60000, label:"2min"},{ value: 90000, label:"5min"},{ value: 300000, label:"10min"},{ value: 300000, label:"15min"},{ value: 900000, label:"30min"}]
        console.log(msg.properties.headers);
        const died = msg.properties.headers["died"] || 0;
        const maxDelayTimes = msg.properties.headers["maxDelayRetries"]
        msg.properties.headers["died"] = died + 1
        const options = { headers: msg.properties.headers }
        // If max died send to dlx
        if (died >= maxDelayTimes || died >= defaultDelay.length) {
            // Handle msgs that expired also the max of retries
            logger.error("Max retries reached");
            if (!this.pubChannel) throw new Error("NO CHANNEL")
            const published = this.pubChannel.publish("dlx", "dlx.dead", msg.content, options);
            if (!published) {
                logger.error("[AMQP] publish failed");
                this.offlinePubQueue.push([this.exchange.name, this.queue.name, msg.content]);
                this.pubChannel.close();
            }
            logger.info(`[AMQP] publish with delay: ${delay ||  defaultDelay[died].label}`);
            return false;
        }
        
        if(delay) Object.assign(options.headers, { "x-delay": delay })
        else Object.assign(options.headers, { "x-delay": defaultDelay[died].value })
        try {
            if (!this.pubChannel) throw new Error("NO CHANNEL")
            const published = this.pubChannel.publish(this.exchange.name, this.queue.name, msg.content, options);
            if (!published) {
                logger.error("[AMQP] publish failed");
                this.offlinePubQueue.push([this.exchange.name, this.queue.name, msg.content]);
                this.pubChannel.close();
            }
            logger.info(`[AMQP] publish with delay: ${delay ||  defaultDelay[died].label}`);
        } catch (e: any) {
            logger.error(`[AMQP] failed ${e.message}`);
            this.offlinePubQueue.push([this.queue.name, msg.content, delay]);
        }
    }

    // A worker that acks messages only if processed succesfully
    async startWorker(queue: string, handler: (msg: Message, cb: any) => void) {
        if(!this.connection) throw new Error("No connection")
        this.workerChannel = await this.connection.createConfirmChannel()
        this.workerChannel.on("error", (err) => {
            if (this.closeOnErr(err)) return;
            logger.error(`[AMQP] channel error ${err.message}`);
        });
    
        this.workerChannel.on("close", function () {
            logger.info("[AMQP] channel closed");
        });

        await this.workerChannel.prefetch(10);
        
        this.workerChannel.consume(queue, (msg) => {
            if (!msg) return;
            handler(msg, (ok: boolean) => {
                if (!this.workerChannel) throw new Error("Channel not initialized")                
                try {
                    if (ok) this.workerChannel.ack(msg as amqp.Message);
                    else {
                        this.workerChannel.ack(msg as amqp.Message)
                        this.publishWithDelay(msg,0)
                    }
                } catch (e) {
                    this.closeOnErr(e as Error);
                }
            });
        }, { noAck: false });
        
        logger.info("Worker is started");
    }
    
    closeOnErr(err: Error) {
        if (!err) return false;
        logger.error(`[AMQP] error ${err}`);
        if(this.connection) this.connection.close();
        return true;
    }
    current_time(){
        const now = new Date();
        let hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
        let minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
        let second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
        return hour + ":" + minute + ":" + second;
    }
}