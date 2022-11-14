/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import { gql } from 'apollo-server-express';

const typeDefs = gql`
scalar Upload

  type Query {
    getProducts: [Product]
  }

  type Mutation {
    createBusiness(business: BusinessInput!, user: BusinessUserInput!): User
   
  }

  input BusinessInput {
    name: String!
    links: LinkInput[]
    page: PageInput[]
    locations: LocationsInput[]
  }

  input LinkInput {
    link: String
    name: String 
  }
  
  input PageInput {
    settings: PageInputSettingsInput 
  }

  input PageInputSettingsInput {
    template: Int
  }

  input LocationsInput {
    name: String
    address: AddressInput
  }

  input AddressInput{
    postalCode: String
    city: String
    street:  String
    houseNubmer: Int
    houseNubmerAddition: String
  }

  input BusinessUserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    image: Upload
  }

  
`;

export { typeDefs };
