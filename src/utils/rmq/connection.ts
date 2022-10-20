import amqp, { ConsumeMessage, Message } from "amqplib"
export const connectRMQ = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Sets the rule: don't dispatch a new message to a worker until it has processed and acknowledged the previous one
    channel.prefetch(1);
    const queue = 'task_queue';
    const msg = process.argv.slice(2).join(' ') || "Hello World!";
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, function (msg) {
        if(!msg) return;
        var secs = msg.content.toString().split('.').length - 1;

        console.log(" [x] Received %s", msg.content.toString());
        setTimeout(function () {
            console.log(" [x] Done");
            channel.ack(msg)
        }, secs * 1000);
    }, {
        noAck: false
    });
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    console.log(" [x] Sent %s", 'test');
    
}
