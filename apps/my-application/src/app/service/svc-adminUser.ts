import UserInputInvite from "../graphql/users/Interfaces";
import { Crypt } from "@my-foods2/crypt"
import { logging as logger } from "@my-foods2/logging";
import MailModule from "../utils/modules/MailModule";
import UploadModule from "../utils/modules/UploadModule";
import { IRole, Role } from "../utils/mongodb/models/Role.schema";
import { AdminUser, IAdminUser, IAdminUserInput, UAdminUser } from "../utils/mongodb/models/AdminUser.schema";
import { exchange, queue } from "../config/rmq";
import { rmq } from "../utils/rmq/rmq";
import { FileUpload } from "graphql-upload";

export default class AdminUserService {
    private user: IAdminUser;
    constructor(user: IAdminUser) {
        this.user = user;
    }

    public static async register(user: IAdminUserInput, businessId: string): Promise<IAdminUser> {
        const uploadImageToImbb = () => new Promise((resolve, reject) => {
            user.image.then(async (f: FileUpload) => {
                try {
                    const body = f.createReadStream();
                    await UploadModule.uploadToImbb(body);
                    resolve(true);
                } catch (e) {
                    logger.error(e)
                    reject("Something went wrong with creating new product.");
                }
            })
        });
        if (user.image) user.image = await uploadImageToImbb()
        user.businesses = [businessId];
        try {
            const createdUser = await AdminUser.create(user);
            rmq.publish(exchange.name, queue.name, Buffer.from(JSON.stringify({
                action: "create_business_user", user
            })), {}, 3)
            return createdUser;
            
        } catch (e) {
            logger.error(e)
            throw new Error("Somethind went wrong with fetching product.")
        }
    }

    public static invite(user: UserInputInvite, hook: string): boolean {
        // Email users
        const { email, companyId, companyName } = user;
        MailModule.send({
            to: email,
            subject: `Invitation to ${companyName}`,
            view: 'template',
            data: {
                name: "",
                message: `You are invited to join the dashboard of ${companyName}. Click the button below to accept this invite and update your infromation.`,
                link: `${hook}?data=${Crypt.encrypt(JSON.stringify(user))}`,
                linkText: "Subscribe",
                buttonColor: "white"
            },
        })
        return true;
    }

    public static async confirm(id: string): Promise<boolean> {
        // Sets confirmed to true
        const res = await AdminUser.updateOne({ id }, { confirmed: true })
        console.log(res);

        return res.acknowledged;
    }

  public async assignRole(name: string) {
        const role = await Role.findOne({ name }).select({ id: true });
        if (!role) throw new Error("Requested Role doesn't exists"); 
        this.user.roles.push(role._id);
        return this.user.save();
    }

    public async update(id: string) {
        console.log("update")
    }


    async checkPermissions(type: string, level: number) {
        console.log('checkPermissions')
    }
}