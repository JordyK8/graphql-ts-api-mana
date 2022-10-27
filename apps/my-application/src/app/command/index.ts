import { connectMongoDB } from '../utils/mongodb/mongoose';
import { runServer } from '../utils/server/apolloExpress';
import { startRmq } from "./rmq";

export const start = async () => {
    await startRmq()
    connectMongoDB();
    await runServer();
};
