import { start } from "./app/command";
import { logging as logger } from "@my-foods2/logging"
import * as constants from "@my-foods2/variables";

main();

async function main() {
  
  logger.info("hoi")
  logger.warn(constants.app)
  
  
  start()
}
