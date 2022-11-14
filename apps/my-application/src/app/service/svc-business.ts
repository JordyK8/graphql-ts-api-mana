
import dotenv from "dotenv"
import { logging as logger } from "@my-foods2/logging";
import { Business, IBusiness } from "../utils/mongodb/models/Business.schema";
import AdminUserService from "./svc-adminUser";
import { misc } from "@my-foods2/variables";
import { IAdminUserInput } from "../utils/mongodb/models/AdminUser.schema";
dotenv.config();

export default class BusinessService {

    public static async create(business: IBusiness, user: IAdminUserInput): Promise<IBusiness> {
        const { name, links, locations } = business;
        try {
            const business = await Business.create({
                name,
                links,
                locations
            });
            const adminUser = await AdminUserService.register(user);
            const adminUserService = new AdminUserService(adminUser);
            await adminUserService.assignRole(misc.business.user.defaultRole);
            return business;
        } catch (e) {
            logger.error(e)
            throw new Error("Somethind went wrong with fetching product.")
        }
    }
}