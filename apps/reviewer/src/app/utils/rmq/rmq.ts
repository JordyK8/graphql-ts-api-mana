import { Amqp } from "@my-foods2/rabbitmq";
import { exchange, queue } from "../../config/rmq";
import { handler } from "../../service/review-handler";

export const connectRmq = async () => {
  const rmq = new Amqp(exchange, queue, "both", handler);
  await rmq.init()
}