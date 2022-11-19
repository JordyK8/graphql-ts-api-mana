/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { IUser } from '../../utils/mongodb/models/User.schema';
import UserService from '../../service/svc-user';
import UserInputInvite from './Interfaces';
import { IBusinessUserInput } from "../../utils/mongodb/models/BusinessUser.schema";
import { IBusiness, IBusinessInput, IBusinessUpdateInput } from "../../utils/mongodb/models/Business.schema";
import BusinessService from "../../service/svc-business";
import { GraphQLUpload } from 'graphql-upload-ts';
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    getBusiness: async (parent: any, { businessId }: { businessId: string }, _: any) => {
      const businessSvc = new BusinessService(businessId);
      return businessSvc.getBusinessObject();
    },
    // getBusinessOfUser: async (parent: any, {}: {}, context: any, info: any) => {
    //   console.log(info);
    //   console.log(context);
    //   return BusinessService.getBusinessObject(context.user.businesses);
    // },
  },

  Mutation: {
    createBusiness: async (parent: any, { business, user }: { business: IBusinessInput, user: IBusinessUserInput }, context: any, info: any) => {
      return BusinessService.create(business, user);
    },
    // updateBusiness: async (parent: any, { businessUpdate }: { businessUpdate: IBusinessUpdateInput }, context: any, info: any) => {
    //   const businessSvc = new BusinessService(businessUpdate._id)
    //   return businessSvc.update(businessUpdate);
    // },
  },
};

export { resolvers };
