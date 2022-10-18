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
      const res = await UserService.register(user)
      return res;
      
    },
    updateProduct: async (parent: any, { product }: { product: IProduct }, { userId }: { userId: string }) => {
      const permission = await checkPermissions(userId, "product", 2);
      if (!permission) throw new Error("NO_ACCESS");
      return ProductService.updateProduct(product)
    },
    deleteProduct: async (parent: any, { product }: { product: IProduct }, { userId }: { userId: string }) => {
      const permission = await checkPermissions(userId, "product", 3);
      if (!permission) throw new Error("NO_ACCESS");
      return ProductService.updateProduct(product)
    },
    checkout: (parent: any, { cart }: { cart: any }, { userId }: { userId: string }) => {
      return OrderService.create(cart)
    },
  },
};

export { resolvers };
