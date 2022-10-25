import { start } from "./app/command";
import { logging as logger } from "@my-foods2/logging"

/**
 * Ensure unhandled exceptions/rejections are still reported
 */
process
    .on('unhandledRejection', (reason, p) => {

        // Also log to regular console err
        // in case it is the logging driver itself causing issues
        // tslint:disable-next-line:no-console
        console.error(`unhandledRejection occurred`);
        // tslint:disable-next-line:no-console
        console.error(reason);

        logger.info(`unhandledRejection occurred`);

        //TODO:  -- ErrorReporting.reportAny(reason);

        // Make process exit as we are likely in invalid state now
        logger.info(`exit proc`);
        process.exit(1);
    })
    .on('uncaughtException', err => {

        // Also log to regular console err
        // in case it is the logging driver itself causing issues
        // tslint:disable-next-line:no-console
        console.error(`uncaughtException occurred`);
        // tslint:disable-next-line:no-console
        console.error(err);

        logger.info(`uncaughtException occurred`);

        // Report the error
        // TODO:  -- ErrorReporting.report(err);

        // Make process exit as we are likely in invalid state now
        logger.info(`exit proc`);
        process.exit(1);
    });

main();

async function main() {
    await start()
}
