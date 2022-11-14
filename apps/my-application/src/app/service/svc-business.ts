import dotenv from "dotenv"
import { logging as logger } from "@my-foods2/logging";
import { Business, IBusiness, IBusinessInput } from "../utils/mongodb/models/Business.schema";
import AdminUserService from "./svc-adminUser";
import { misc } from "@my-foods2/variables";
import { IAdminUserInput } from "../utils/mongodb/models/AdminUser.schema";
import UploadModule from "../utils/modules/UploadModule";
dotenv.config();

export default class BusinessService {

    public static async create(business: IBusinessInput, user: IAdminUserInput): Promise<IBusiness> {
        console.log('business', business);
        
        const { name, links, locations } = business;
        try {
            const business = await Business.create({
                name,
                links,
                locations
            });
            const adminUser = await AdminUserService.register(user, business._id);
            const adminUserService = new AdminUserService(adminUser);
            await adminUserService.assignRole(misc.business.user.defaultRole);
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
}