// import amqp, { ConsumeMessage, Message } from "amqplib"
import Amqp from "./Rmq";


export const connectRMQ = async () => {
    // worker()
    // task()
    const rmq = new Amqp("test-ex", "test-q");
    await rmq.start();
    const rmq2 = new Amqp("test-ex2", "test-q2");
    await rmq2.start();
    //Publish a message every 10 second. The message will be delayed 10seconds.
    setInterval(function() {
        const date = new Date();
        const time = rmq.current_time()
        rmq.publish("test-q", Buffer.from("work sent: " + time), 10000);
    }, 10000);
    setInterval(function() {
        const date = new Date();
        const time = rmq2.current_time()
        rmq2.publish("test-q2", Buffer.from("work sent2: " + time), 3000);
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
