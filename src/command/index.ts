/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import { connectMongoDB } from '../utils/mongodb/mongoose';
import { connectRMQ } from '../utils/rmq/connection';
import { runServer } from '../utils/server/apolloExpress';

(async() => {
    connectMongoDB();
    await connectRMQ();
    await runServer();
})();
