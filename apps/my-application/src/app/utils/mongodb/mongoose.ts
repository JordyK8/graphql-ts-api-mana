/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import mongoose from 'mongoose';
import { accessibleRecordsPlugin } from '@casl/mongoose';
import { logger } from '../logging/logger';


// it is mongo memory server for boilerplate sample
// remove it and replace to real mongoDB in production environment
function connectMongoDB(): void {

    // Implementiong CASL and using its plugin here
    mongoose.plugin(accessibleRecordsPlugin);

    // replace real mongoDB connection in production environment

    // If on a linux server, use the hostname provided by the docker compose file
    // e.g. HOSTNAME = mongo1, mongo2, mongo3

    // If on MacOS add the following to your /etc/hosts file.
    // 127.0.0.1  mongo1
    // 127.0.0.1  mongo2
    // 127.0.0.1  mongo3
    // And use localhost as the HOSTNAME
    mongoose.connect('mongodb://localhost:27017/shop', {
        
    })

    mongoose.connection.on('error', e => {
        logger.error(e);
    });

    mongoose.connection.once('open', () => {
        logger.info(`MongoDB successfully connected`);
    });

}

function disconnectMongoDB() {
    mongoose.disconnect();
}

export { connectMongoDB, disconnectMongoDB };
