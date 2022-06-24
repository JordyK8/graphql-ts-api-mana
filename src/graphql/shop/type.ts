/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import { gql } from 'apollo-server-express';

const typeDefs = gql`
scalar Upload

  type Query {
    product(productId: String!): Product
    getProducts: [Product]
  }

  type Mutation {
    createProduct(product: ProductInput!): Product
    updateProduct(product: ProductInput!): Product
    deleteProduct(productId: String!): Boolean
    checkout(cart: [ShoppingCartProduct!]!): CheckoutReturn
  }

  type Product {
    _id: ID!
    details: String
    price: Int
    name: String
    image: String
  }

  type CheckoutReturn {
    _id: ID!
    url: String!
    status: String
  }

  input ProductInput {
    _id: ID
    details: String!
    price: Int!
    name: String!
    image: Upload!
  }

  input ShoppingCartProduct {
    _id: ID!
    name: String
    details: String
    price: Int!
    amount: Int!
    image: String
  }

`;

export { typeDefs };
