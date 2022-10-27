import { Message } from "amqplib";

export function handler(msg: Message, cb: any) {
  console.log("received in reviewer : " + JSON.stringify(JSON.parse(msg.content.toString())))
  return cb(true);
}