import { logging as logger } from "@my-foods2/logging";
import { Message } from "amqplib";
import ReviewService from "./svc-review";

export async function handler(msg: Message, cb: any) {
  try { 
    console.log("received in reviewer %o : " + JSON.stringify(JSON.parse(msg.content.toString())))
    const data = JSON.parse(msg.content.toString());
    switch (data.action) {
      case 'create_review':
        await ReviewService.handlePostReviewOperations()
        break;
    
      default:
        break;
    }
    return cb(true);
  } catch (e) {
    logger.error(e)
    return cb(false)
  }
}
