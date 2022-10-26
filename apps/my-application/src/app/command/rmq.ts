import { Amqp } from "@my-foods2/rabbitmq";
import { Message } from "amqplib";
import { exchange, queue } from "../config/rmq";

export const rmq = new Amqp(exchange, queue);

export const startRmq = async () => {
  await rmq.init();
  await rmq.startPublisher(queue.name, exchange.name);
  await rmq.startWorker(queue.name, (msg: Message, cb: any) => {
    console.log(JSON.parse(msg.content.toString()))
    cb(false)
  })
}

