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
    getBusiness: async (parent: any, { businessId }: { businessId: string }, _: any) => {
      const businessSvc = new BusinessService(businessId);
      return businessSvc.getBusinessObject();
    },
    getBusinessOfUSer: async (parent: any, {}: {}, context: any, info: any) => {
      console.log(info);
      console.log(context);
      return BusinessService.getBusinessObject(context.user.businesses);
    },
  },

  Mutation: {
    createBusiness: async (parent: any, { business, user }: { business: IBusinessInput, user: IBusinessUserInput }, _: any) => {
      return BusinessService.create(business, user);
    },
  },
};

export { resolvers };
