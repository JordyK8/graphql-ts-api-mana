import { Amqp } from "@my-foods2/rabbitmq";
import { Message } from "amqplib";
import { exchange, queue } from "../../config/rmq";

export const rmq = new Amqp(exchange, queue, "publisher");

export const startRmq = async () => {
  await rmq.init();
  await rmq.startPublisher(queue.name, exchange.name);
  rmq.publish(exchange.name, queue.name, Buffer.from(JSON.stringify({ test: "hoi1 from my-applivation" })), {}, 3)
  await rmq.startWorker(queue.name, (msg: Message, cb: any) => {
    console.log('RECEIVED %o', JSON.parse(msg.content.toString()))
    cb(true)
  })
}

