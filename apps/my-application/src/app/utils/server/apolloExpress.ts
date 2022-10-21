/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import express from 'express';
import errorhandler from 'errorhandler';
import http from 'http';
import cookieParser from 'cookie-parser';
import { ApolloServer, ApolloServerExpressConfig, ServerRegistration } from 'apollo-server-express';
import { createTerminus } from '@godaddy/terminus';
import { disconnectMongoDB } from '../mongodb/mongoose';
import { allSchema } from '../../graphql/schema';
import helmet from 'helmet';
import { logger } from '../logging/logger';
import { graphqlUploadExpress } from "graphql-upload"
import cors from "cors";
import JWT from '../JWT';
async function runServer() {
  const app = express();
  const port = 3000;

  if (process.env.NODE_ENV === 'development') {
    app.use(errorhandler());
  }

  // compression : recommanded to use nginx gzip compression directive
  // response header : recommanded to use nginx add header directive
  app.use(cors({
    credentials: true,
    origin: "*"
  }))
  app.use(helmet())
  app.use(cookieParser());
  applyApollo(app);

  // create server
  const server = http.createServer(app);

  // add terminus cleanup config
  const cleanupOptions = {
    onSignal,
    onShutdown,
    timeout: 10000,
    signals: ['SIGINT', 'SIGTERM'],
  };

  createTerminus(server, cleanupOptions);

  // start server
  server.listen(port, () => {
    logger.info(`express server is listening port ${port}`);
  });
}

async function applyApollo(app: any) {
  // applly apollo confing to express app
  const apolloConfig: ApolloServerExpressConfig = {
    schema: allSchema,
    context: async (ctx: any) => {
      let userId;
      console.log(ctx.req.headers);
      
      const token = ctx.req.headers.authorization as any || '';
      // if (token) userId = JWT.decipher(token);
      console.log('token', token);
      return { userId };
    },
    formatError: error => {
      logger.error(`[Graphql ERROR] ${error}`);
      return error;
    },
  };

  const apolloRegistration: ServerRegistration = {
    app,
    path: '/graphql',
    cors: {
      credentials: true,
      origin:
        (origin, callback) => {
        console.log('origin', origin);
          const whitelist = [
            "http://localhost:8080",
            undefined,
          ];
          if(!origin) return callback(null, true)
        if (whitelist.includes(origin)) {
            console.log('yes');
            
              callback(null, true)
          } else {
              callback(new Error("Not allowed by CORS"))
          }
      }
    },
    bodyParserConfig: true,
  };

  const apollo = new ApolloServer(apolloConfig);

  await apollo.start();
  app.use(graphqlUploadExpress());
  apollo.applyMiddleware(apolloRegistration);
}

async function onSignal() {
  logger.info('server is starting cleanup');
  return Promise.all([disconnectMongoDB()]);
}

async function onShutdown() {
  logger.info('cleanup finished, server is shutting down');
}

export { runServer };
