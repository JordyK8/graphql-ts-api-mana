import amqp from "amqplib";
import { logging as logger } from "@my-foods2/logging";

export default class Amqp {
    private workerChannel: amqp.Channel | null;
    private pubChannel: amqp.Channel | null;
    private exchange: string;
    private offlinePubQueue: any;
    private queue: string;
    private connection: amqp.Connection | null;
    constructor(exchange: string, queue: string) {
        this.pubChannel = null;
        this.workerChannel = null;
        this.offlinePubQueue = [];
        this.connection = null;
        this.queue = queue;
        this.exchange = exchange;
    }
    async start() {        
        this.connection = await amqp.connect("amqp://admin:password@localhost" + "?heartbeat=60");
        
        if (!this.connection) throw new Error("NO_AMQP_CONNECTION")
        this.connection.on("error", (err) => {
            if (err.message !== "Connection closing")
                logger.error(`[AMQP] conn error ${err.message}`);
        });
    
        this.connection.on("close", () => {
            logger.error("[AMQP] reconnecting");
            return setTimeout(this.start, 1000);
        });
    
        logger.info("[AMQP] connected");
        await this.whenConnected();
    }
    async whenConnected() {
        await this.startPublisher();
        await this.startWorker();
    }
    async startPublisher() {
        if(!this.connection) throw new Error("No connection")
        this.pubChannel = await this.connection.createConfirmChannel()
        this.pubChannel.on("error", (err) => {
            if (this.closeOnErr(err)) return;
            logger.error(`[AMQP] channel error ${err.message}`);
        });
    
        this.pubChannel.on("close", function () {
            logger.info("[AMQP] channel closed");
        });
    
        //assert the exchange: 'my-delay-exchange' to be a x-delayed-message,
        this.pubChannel.assertExchange(this.exchange, "x-delayed-message", { autoDelete: false, durable: true, arguments: { 'x-delayed-type': "direct" } })
        //Bind the queue: this.queue to the exchnage: this.exchange with the binding key this.queue
        this.pubChannel.bindQueue(this.queue, this.exchange, this.queue);
    
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const m = this.offlinePubQueue.shift();
            if (!m) break;
            this.publish(m[0], m[1], m[2]);
        }
    }
    publish(routingKey: string, content: any, delay: number) {
        try {
            if (!this.pubChannel) return this.start()
            const published = this.pubChannel.publish(this.exchange, routingKey, content, { headers: { "x-delay": delay } });
            if (!published) {
                logger.error("[AMQP] publish failed");
                this.offlinePubQueue.push([this.exchange, routingKey, content]);
                this.pubChannel.close();
            }
        } catch (e: any) {
            logger.error(`[AMQP] failed ${e.message}`);
            this.offlinePubQueue.push([routingKey, content, delay]);
        }
    }
    // A worker that acks messages only if processed succesfully
    async startWorker() {
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
        await this.workerChannel.assertQueue(this.queue, { durable: true });
        this.workerChannel.consume(this.queue, (msg) => {
            if (!msg) return;
            this.work(msg, (ok: boolean) => {
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

    work(msg: amqp.Message, cb: any) {
        logger.info(msg.content.toString() + " --- received: " + this.current_time());
        cb(true);
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