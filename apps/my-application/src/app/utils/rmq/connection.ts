// import amqp, { ConsumeMessage, Message } from "amqplib"
import Amqp from "./Rmq";
import { logging as logger } from "@my-foods2/logging";
import { Message } from "amqplib";

export const connectRMQ = async () => {
    // worker()
    // task()
    const exchanges = [{
        exchange: "test-x2",
        type: 'direct',
        options: { autoDetele: false, durable: true }
    },
    {
        exchange: "dlx.cmd",
        type: "direct",
        options: { autoDelete: false, durable: true }
        }
    ]
    const queues = [
        {
            queue: "cmd-dlx-queue",
            options: { durable: true }
            },
        {
        queue: "test-q2",
        options: { durable: true, deadLetterExchange: "dlx.cmd" },
    },
    ]
    const rmq = new Amqp(exchanges, queues);
    await rmq.init();
    await rmq.startWorker("test-q2", (msg: Message, cb: any) => {
        logger.info(msg.content.toString() + " --- received: " + rmq.current_time());
        const is = Math.floor(Math.random() * 4) === 2
        cb(true);
    });
    await rmq.startPublisher(queues[0].queue, exchanges[0].exchange);
    //Publish a message every 10 second. The message will be delayed 10seconds.
    setInterval(function() {
        const date = new Date();
        const time = rmq.current_time()
        rmq.publish(exchanges[0].exchange, queues[0].queue, Buffer.from("work sent: " + time), {}, 3);
    }, 3000);    
}

// async function task() {
//     const connection = await amqp.connect('amqp://localhost');
//     const channel = await connection.createChannel();

//     // Sets the rule: don't dispatch a new message to a worker until it has processed and acknowledged the previous one
//     channel.prefetch(1);
//     const queue = 'task_queue';
//     const msg = process.argv.slice(2).join(' ') || "Hello World!";
//     await channel.assertQueue(queue, { durable: true, messageTtl: 5000 });
//     channel.sendToQueue(queue, Buffer.from(msg), { persistent: true, headers: { "x-delay": 5000 } });
//     // channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
//     // channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
//     console.log(" [x] Sent %s", 'test');
// } 

// async function worker() {
//     const connection = await amqp.connect('amqp://localhost');
//     const channel = await connection.createChannel();

//     // Sets the rule: don't dispatch a new message to a worker until it has processed and acknowledged the previous one
//     channel.prefetch(1);
//     const queue = 'task_queue';
//     await channel.assertQueue(queue, { durable: true, messageTtl: 5000 });
//     channel.consume(queue, function (msg) {
//         console.log(msg);
        
//         if(!msg) return;
//         const secs = msg.content.toString().split('.').length - 1;

//         console.log(" [x] Received %s", msg.content.toString());
//         setTimeout(function () {
//             console.log(" [x] Done");
//             channel.ack(msg)
//         }, 1000);
//     }, {
//         noAck: false
//     });
// }
