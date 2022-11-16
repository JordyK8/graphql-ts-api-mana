import dotenv from "dotenv"
import { logging as logger } from "@my-foods2/logging";
import { Business, IBusiness, IBusinessInput } from "../utils/mongodb/models/Business.schema";
import BusinessUserService from "./svc-businessUser";
import { misc } from "@my-foods2/variables";
import { IBusinessUserInput } from "../utils/mongodb/models/BusinessUser.schema";
import UploadModule from "../utils/modules/UploadModule";
import { rmq } from "../utils/rmq/rmq";
import { exchange, queue } from "../config/rmq";
dotenv.config();

export default class BusinessService {

    // Creates Business entity, BusinessUser entity and connect business to business user.
    public static async create(business: IBusinessInput, user: IBusinessUserInput): Promise<IBusiness> {
        console.log('business', business);
        
        const { name, links, locations } = business;
        locations = LocationsModule.getCoords(locations);
        try {
            const business = await Business.create({
                name,
                links,
                locations
            });
            const businessUser = await BusinessUserService.register(user, business._id);
            const businessUserService = new BusinessUserService(businessUser, business);
            await businessUserService.assignRole(misc.business.user.roles.owner);
            rmq.publish(exchange.name, queue.name, Buffer.from(JSON.stringify({
                action: "create_business", business
            })), {}, 3)
            return business;
        } catch (e) {
            logger.error(e)
            throw new Error("Somethind went wrong with fetching product.")
        }
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

    async getNearby(location:any) {
        // get postalcodes from google maps api
        const postalCodes = ["3315MT"]
        const companies = await Business.find({"locations.address.postalCode" : { $in: postalCodes }})
            .limit(misc.pagination.businessFindNearyLimit)
            .sort()

    }
}