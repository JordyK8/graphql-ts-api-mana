/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import { connectMongoDB } from '../utils/mongodb/mongoose';
import { runServer } from '../utils/server/apolloExpress';

connectMongoDB();
runServer();
