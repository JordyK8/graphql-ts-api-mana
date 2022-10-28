import { logging as logger } from "@my-foods2/logging";
import { Message } from "amqplib";

export function handler(msg: Message, cb: any) {
  try { 
    console.log("received in reviewer : " + JSON.stringify(JSON.parse(msg.content.toString())))
    return cb(true);
  } catch (e) {
    logger.error(e)
    return cb(false)
  }
}