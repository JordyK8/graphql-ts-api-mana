import { connectMongoDB } from '../utils/mongodb/mongoose';
import { runServer } from '../utils/server/apolloExpress';
import { startRmq } from "../utils/rmq/rmq";

export const start = async () => {
    await startRmq()
    connectMongoDB();
    await runServer();
};
