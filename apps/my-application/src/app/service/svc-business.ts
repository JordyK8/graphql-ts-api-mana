import { rmq } from "../command/rmq";
import { exchange, queue } from "../config/rmq";
import BusinessRegistrationInput from "../graphql/businesses/interfaces";
import { Business } from "../utils/mongodb/models/Business.schema";
import { User } from "../utils/mongodb/models/User.schema";
import UploadModule from "../utils/modules/UploadModule";
import { logging as logger } from "@my-foods2/logging";


export default class BusinessService {
    constructor() {

    }

    async registerNewBusiness(registrationData: BusinessRegistrationInput) {
        // Create Business
        const business = await Business.create(registrationData.business);
        // Create User
        const user = await User.create(registrationData.user);
        // TODO: rmq msg
    }

    async handleAsset(asset: any, businessId: string, assetName: string) {
        const uploadImageToImbb = async () => asset.then(async (f: any) => {
            try {
                const body = f.createReadStream();
                return UploadModule.uploadToImbb(body);
            } catch (e) {
                logger.error(e)
                throw new Error("Something went wrong with creating new product.");
            }
        })
        const url = await uploadImageToImbb()

        return Business.updateOne({ _id: businessId }, { page: { $push: { assets: { [assetName]: url } } } })
    }
}