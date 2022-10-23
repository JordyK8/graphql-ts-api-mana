import amqp, { Message, Options } from "amqplib";
import { logging as logger } from "@my-foods2/logging";

interface ExchangeObject {
    exchange: string,
    type: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' | 'x-delayed-message' | string,
    options?: Options.AssertExchange
}
interface QueueObject {
    queue: string,
    options?: Options.AssertQueue
}

export default class Amqp {
    private workerChannel: amqp.Channel | null;
    private channel: amqp.Channel | null;
    private pubChannel: amqp.Channel | null;
    private exchanges: ExchangeObject[];
    private offlinePubQueue: any;
    private queues: QueueObject[];
    private connection: amqp.Connection | null;

    constructor(exchanges: ExchangeObject[], queues: QueueObject[]) {
        this.channel = null;
        this.pubChannel = null;
        this.workerChannel = null;
        this.offlinePubQueue = [];
        this.connection = null;
        this.queues = queues;
        this.exchanges = exchanges;
    }
    async init() {        
        this.connection = await amqp.connect("amqp://admin:password@localhost" + "?heartbeat=60");
        
        if (!this.connection) throw new Error("NO_AMQP_CONNECTION")
        this.connection.on("error", (err) => {
            if (err.message !== "Connection closing")
                logger.error(`[AMQP] conn error ${err.message}`);
        });
    
        this.connection.on("close", () => {
            logger.error("[AMQP] reconnecting");
            return setTimeout(this.init, 1000);
        });
    
        logger.info("[AMQP] connected");
        await this.whenConnected();
    }
    async whenConnected() {
        await this.createExchanges();
        await this.createQueues();
    }

    private async createExchanges() {
        if (!this.connection) throw new Error("No connection when creating exchanges");
        this.channel = await this.connection.createConfirmChannel()
        if (!this.channel) throw new Error("No channel open when creating exchanges");
        // try reconnecting on no connection and do this a few times then only throw error;
        for (const exchange of this.exchanges) {
            // exchange example : {name: 'test-exchange', type: "x-delayed-message", options: { autoDetele: false, durable:true, arguments: { "x-delayed-type": "direct"}}}
            await this.channel.assertExchange(exchange.exchange, exchange.type, exchange.options)
        }
    }
    private async createQueues() {
        if (!this.connection) throw new Error("No connection when creating exchanges");
        this.channel = await this.connection.createConfirmChannel()
        if (!this.channel) throw new Error("No channel open when creating exchanges");
        // try reconnecting on no connection and do this a few times then only throw error;
        for (const queue of this.queues) {
            // queue example : {name: 'test-q', options: { durable: true }
            await this.channel.assertQueue(queue.queue, queue.options)
        }
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
    
        ////assert the exchange: 'my-delay-exchange' to be a x-delayed-message,
        // this.pubChannel.assertExchange(this.exchange, "x-delayed-message", { autoDelete: false, durable: true, arguments: { 'x-delayed-type': "direct" } })
        
        //Bind the queue: this.queue to the exchnage: this.exchange with the binding key this.queue
        // second this.queue (3rd arg) is routingkey
        this.pubChannel.bindQueue(queue, exchange, queue);
        
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const m = this.offlinePubQueue.shift();
            if (!m) break;
            this.publish(m[0], m[1], m[2], m[3], 3);
        }
    }
    publish(exchange: string, routingKey: string, content: any, options: Options.Publish, maxDelayRetries: number) {
        options.headers = { maxDelayRetries };
        try {
            if (!this.pubChannel) throw new Error("NO CHANNEL")
            const published = this.pubChannel.publish(exchange, routingKey, content, options);
            if (!published) {
                logger.error("[AMQP] publish failed");
                this.offlinePubQueue.push([exchange, routingKey, content, options]);
                this.pubChannel.close();
            }
        } catch (e: any) {
            logger.error(`[AMQP] failed ${e.message}`);
            this.offlinePubQueue.push([exchange, routingKey, content, options]);
        }
    }
    // publishWithDelay(msg: Message) {
    //     console.log(msg.properties.headers["x-death"]);
    //     console.log(msg.properties.headers);
        
    //     if(msg.properties.headers["x-death"] > msg.properties.headers.maxDelayRetries)
    //     if(delay) Object.assign(options.headers, { "x-delay": delay })
    //     try {
    //         if (!this.pubChannel) throw new Error("NO CHANNEL")
    //         const published = this.pubChannel.publish(exchange, routingKey, content, options);
    //         if (!published) {
    //             logger.error("[AMQP] publish failed");
    //             this.offlinePubQueue.push([exchange, routingKey, content]);
    //             this.pubChannel.close();
    //         }
    //     } catch (e: any) {
    //         logger.error(`[AMQP] failed ${e.message}`);
    //         this.offlinePubQueue.push([routingKey, content, delay]);
    //     }
    // }

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
        await this.workerChannel.assertQueue(queue, { durable: true });
        
        this.workerChannel.consume(queue, (msg) => {
            if (!msg) return;
            console.log(msg.properties.headers["x-death"]);
            console.log(msg.properties.headers);
            console.log(msg.properties
            );
            handler(msg, (ok: boolean) => {
                if (!this.workerChannel) throw new Error("Channel not initialized")
                try {
                    if (ok) this.workerChannel.ack(msg as amqp.Message);
                    else this.workerChannel.reject(msg as amqp.Message, true);
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