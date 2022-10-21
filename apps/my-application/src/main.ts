import { start } from "./app/command";
import { logging as logger } from "@my-foods2/logging"

main();

async function main() {
  
  logger.info("hoi")
  
  
  start()
}
