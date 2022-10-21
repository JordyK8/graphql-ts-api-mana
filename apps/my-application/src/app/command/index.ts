/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import { logging as logger } from "@my-foods2/logging";
import { connectMongoDB } from '../utils/mongodb/mongoose';
import { connectRMQ } from '../utils/rmq/connection';
import { runServer } from '../utils/server/apolloExpress';

export const start = async () => {
    console.log("HALLOOOWWW???")
    logger.info("HAOAJOSJHDLKJDHLKSJHSLKJSHLKSJHSLKJSHLSKJSHLKSJH")
    connectMongoDB();
    await connectRMQ();
    await runServer();
};
