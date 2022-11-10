import g from "graphql-upload";
import BusinessService from "../../service/svc-business";
import BusinessRegistrationInput from "./interfaces";
const resolvers = {
    Upload: g.GraphQLUpload,
    Query: {
    
    },

    Mutation: {
        registerBusiness: async(parent: any, { registrationData }: { registrationData: BusinessRegistrationInput }, _: any) => {
            const businessSvc = new BusinessService()
            return businessSvc.registerNewBusiness(registrationData)
        },
    },
};

export { resolvers };
