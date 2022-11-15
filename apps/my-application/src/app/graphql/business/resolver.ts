/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import g from "graphql-upload";
import { IUser } from '../../utils/mongodb/models/User.schema';
import UserService from '../../service/svc-user';
import UserInputInvite from './Interfaces';
import { IBusinessUserInput } from "../../utils/mongodb/models/BusinessUser.schema";
import { IBusiness, IBusinessInput } from "../../utils/mongodb/models/Business.schema";
import BusinessService from "../../service/svc-business";
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
    createBusiness: async (parent: any, { business, user }: { business: IBusinessInput, user: IBusinessUserInput }, _: any) => {
      return BusinessService.create(business, user);
    },
  },
};

export { resolvers };
