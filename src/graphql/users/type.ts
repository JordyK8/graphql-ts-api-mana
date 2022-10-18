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
    createUser(user: UserInput!): User
    updateUser(product: ProductInput!): Product
    deleteUser(productId: String!): Boolean
    getUser(cart: [ShoppingCartProduct!]!): CheckoutReturn
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

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    image: Upload
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
