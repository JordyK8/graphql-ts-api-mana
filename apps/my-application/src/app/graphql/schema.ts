/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import { mergeSchemas } from '@graphql-tools/schema';
import { businessSchema } from './business/schema';
import { userSchema } from './users/schema';

export const allSchema = mergeSchemas({
  schemas: [userSchema, businessSchema],
});
