import dotenv from "dotenv"
import { logging as logger } from "@my-foods2/logging";
import { Business, IBusiness, IBusinessInput } from "../utils/mongodb/models/Business.schema";
import BusinessUserService from "./svc-businessUser";
import { misc } from "@my-foods2/variables";
import { IBusinessUser, IBusinessUserInput, UBusinessUser } from "../utils/mongodb/models/BusinessUser.schema";
import UploadModule from "../utils/modules/UploadModule";
import { rmq } from "../utils/rmq/rmq";
import { exchange, queue } from "../config/rmq";
import LocationsModule from "../utils/modules/LocationsModule";
import { determineUpdateFields } from "../utils/mongodb/models/basicOperations";
dotenv.config();

export default class BusinessService {
    public _id: string;
    constructor(_id: string) {
        this._id = _id;
    }

    // Get business object from DB
    async getBusinessObject() {
        return Business.findOne({ _id: this._id });
    }

    static async getBusinessObject(user: UBusinessUser) {
        if(!Array.isArray(user.businesses)) {
            if(typeof user.businesses === 'string') user.businesses = [user.businesses];
            else throw Error(`Error getting businesses of user ${user._id} since businesses is of type ${typeof user.businesses} in stead of type string or array`);
        }
        return Business.find({ _id: { $in: user.businesses } });
    }

    public async updateBusiness(updateItem: any) {
        const fields = determineUpdateFields('business', updateItem);
        return Business.findOneAnyUpdate({ _id: this._id }, { $set: fields });
    }


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