/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import g from "graphql-upload";
import { IUser } from '../../utils/mongodb/models/User.schema';
import UserService from '../../service/svc-user';
import UserInputInvite from './Interfaces';
const resolvers = {
  Upload: g.GraphQLUpload,
  Query: {
    // product: (parent: any, { productId }: { productId: string }, { userId }: { userId: string }) => {
    //   return ProductService.getProduct(productId)
    // },
    // getProducts: (parent: any) => {
    //   return ProductService.getProductList()
    // },
  },

  Mutation: {
    createUser: async (parent: any, { user }: { user: IUser }, _: any) => {
      console.log('here', user);
      
      return UserService.register(user)
    },
    inviteUser: async (parent: any, { user, hook }: { user: UserInputInvite, hook: string }, { userId }: { userId: string }) => {
      return UserService.invite(user, hook)
    },
    confirmUser: async (parent: any, { id }: { id: string }, { userId }: { userId: string }) => {
      return UserService.confirm(id)
    },
    updateUser: async (parent: any, { id }: { id: string }, { userId }: { userId: string }) => {
      // return UserService.update(id)
    },
  },
};

export { resolvers };
