import UserInputInvite from "../graphql/users/Interfaces";
import { Crypt } from "@my-foods2/crypt"
import { logging as logger } from "@my-foods2/logging";
import MailModule from "../utils/modules/MailModule";
import UploadModule from "../utils/modules/UploadModule";
import { Role } from "../utils/mongodb/models/Role.schema";
import { BusinessUser, IBusinessUser, IBusinessUserInput } from "../utils/mongodb/models/BusinessUser.schema";
import { exchange, queue } from "../config/rmq";
import { rmq } from "../utils/rmq/rmq";
import { FileUpload } from "graphql-upload";
import { IBusiness } from "../utils/mongodb/models/Business.schema";

export default class BusinessUserService {
    private businessUser: IBusinessUser;
    private business : IBusiness;
    constructor(businessUser: IBusinessUser, business: IBusiness) {
        this.businessUser = businessUser;
        this.business = business;
    }

    public static async register(user: IBusinessUserInput, businessId: string): Promise<IBusinessUser> {
        
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
            console.log("USER", user);
            
            const createdUser = await BusinessUser.create(user);
            console.log('CREATEDDD', createdUser);
            
            rmq.publish(exchange.name, queue.name, Buffer.from(JSON.stringify({
                action: "create_business_user", user
            })), {}, 3)
            return createdUser;
            
        } catch (e) {
            logger.error(e)
            throw new Error("Somethind went wrong with fetching product.")
        }
    }

    public async invite(email: string, hook: string): Promise<void> {
        // Email users
        await MailModule.send({
            to: email,
            subject: `Invitation to ${this.business.name}`,
            view: 'template',
            data: {
                name: "",
                message: `You are invited to join the dashboard of ${this.business.name}. Click the button below to accept this invite and update your infromation.`,
                link: `${hook}?data=${Crypt.encrypt(JSON.stringify(this.business._id))}`,
                linkText: "Subscribe",
                buttonColor: "white"
            },
        })
    }

    public static async confirm(id: string): Promise<boolean> {
        // Sets confirmed to true
        const res = await BusinessUser.updateOne({ id }, { confirmed: true })
        console.log(res);

        return res.acknowledged;
    }

    public async assignRole(name: string) {
        console.log('assign role', name, "to", this.businessUser.firstName);
        return 
        // const role = await Role.findOne({ name }).select({ id: true });
        // if (!role) throw new Error("Requested Role doesn't exists"); 
        // this.businessUser.roles.push(role._id);
        // return this.businessUser.save();
    }

    public async update(id: string) {
        console.log("update")
    }


    async checkPermissions(type: string, level: number) {
        console.log('checkPermissions')
    }
}