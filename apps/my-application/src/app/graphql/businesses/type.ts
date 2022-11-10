/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import { gql } from 'apollo-server-express';

const typeDefs = gql`
scalar Upload

    type Query {
        business(businessId: String!): Business
        getProducts: [Product]
    }

    type Mutation {
        registerBusiness(registrationData: BusinessRegistrationInput!): User
    }


    type Business {

    }

    input BusinessRegistrationInput {
        
    }


`;

export { typeDefs };
