/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import { resolvers } from './resolver';
import { typeDefs } from './type';
import { makeExecutableSchema } from '@graphql-tools/schema';

const userSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export { userSchema };
