import UserInputInvite from "../graphql/users/Interfaces";
import { Crypt } from "@my-foods2/crypt"
import { logging as logger } from "@my-foods2/logging";
import { exchange, queue } from "../config/rmq";
import { rmq } from "../utils/rmq/rmq";
import { FileUpload } from "graphql-upload";
import { BusinessUser, IBusinessModel, IBusinessUser, IBusinessUserInput, MailModule, UploadModule } from "@my-foods2/utils/utils";

export default class BusinessUserService {
    private businessUser: IBusinessUser;
    private business : IBusinessModel;
    constructor(businessUser: IBusinessUser, business: IBusinessModel) {
        this.businessUser = businessUser;
        this.business = business;
    }

    public static async register(user: IBusinessUserInput, businessId: string): Promise<IBusinessUser> {
        
        if (user.image) user.image = await UploadModule.graphQlUpload(user.image)
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
        const mailModule = new MailModule()
        await mailModule.send({
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