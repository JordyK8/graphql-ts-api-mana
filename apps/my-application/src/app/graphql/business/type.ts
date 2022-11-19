/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import { gql } from 'apollo-server-express';

const typeDefs = gql`
scalar Upload

  type Query {
    getBusiness: String
  }

  type Mutation {
    createBusiness(business: BusinessInput!, user: BusinessUserInput!): BusinessUser!
   
  }

  input BusinessInput {
    name: String!
    links: [LinkInput]
    page: PageInput
    location: LocationsInput
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
    houseNumber: Int
    houseNumberAddition: String
  }

  input BusinessUserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    image: Upload
  }

  type BusinessUser {
    _id: ID!
    email: String!
    firstName: String!
    lastName: String!
  }

  
`;

export { typeDefs };
