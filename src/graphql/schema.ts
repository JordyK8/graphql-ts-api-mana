/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import { mergeSchemas } from '@graphql-tools/schema';
import { productSchema } from './users/schema';

export const allSchema = mergeSchemas({
  schemas: [productSchema],
});
