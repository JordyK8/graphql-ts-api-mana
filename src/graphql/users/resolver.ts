/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import ProductService from '../../service/svc-product';
import { IProduct } from '../../utils/mongodb/models/Product.schema';
import { GraphQLUpload } from "graphql-upload";
import OrderService from '../../service/svc-order';
import { checkPermissions } from '../middleware';
import { IUser } from '../../utils/mongodb/models/User.schema';
import UserService from '../../service/svc-user';
import UserInputInvite from './Interfaces';
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    product: (parent: any, { productId }: { productId: string }, { userId }: { userId: string }) => {
      return ProductService.getProduct(productId)
    },
    getProducts: (parent: any) => {
      return ProductService.getProductList()
    },
  },

  Mutation: {
    createUser: async(parent: any, { user }: { user: IUser }, _: any) => {
      return UserService.register(user)
    },
    inviteUser: async (parent: any, { user, hook }: { user: UserInputInvite, hook: string }, { userId }: { userId: string }) => {
      return UserService.invite(user, hook)
    },
    confirmUser: async (parent: any, { id }: { id: string }, { userId }: { userId: string }) => {
      return UserService.confirm(id)
    },
  },
};

export { resolvers };
