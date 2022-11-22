import UserInputInvite from "../graphql/users/Interfaces";
import { Crypt } from "@my-foods2/crypt"
import { logging as logger } from "@my-foods2/logging";
import MailModule from "../utils/modules/MailModule";
import UploadModule from "../utils/modules/UploadModule";
import { IRole, Role } from "../utils/mongodb/models/Role.schema";
import { IUser, IUserInput, User, IUserModel } from "../utils/mongodb/models/User.schema";
import { exchange, queue } from "../config/rmq";
import { rmq } from "../utils/rmq/rmq";
import { FileUpload } from "graphql-upload";
import { IReviewInput } from "../utils/mongodb/models/Review.schema";

export default class UserService {
    private user: IUserModel;
    constructor(user: IUser) {
        this.user = user;
    }

    public static async register(user: IUserInput): Promise<IUser> {
        console.log('user', user);
        
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
        user.image = await uploadImageToImbb()
        try {
            const createdUser = await User.create(user);
            rmq.publish(exchange.name, queue.name, Buffer.from(JSON.stringify({
                action: "create_user", user
            })), {}, 3)
            return createdUser;
            
        } catch (e) {
            logger.error(e)
            throw new Error("Somethind went wrong with fetching product.")
        }
    }

    public async invite(user: UserInputInvite, hook: string): Promise<void> {
        // Email users
        const { email, name } = user;
        await MailModule.send({
            to: email,
            subject: `Invitation by ${this.user.firstName}`,
            view: 'template',
            data: {
                name,
                message: `You are invited to by ${this.user.firstName} to join the food review sensation fo the world. Click the button below to accept this invite and update your infromation.`,
                link: `${hook}?data=${Crypt.encrypt(JSON.stringify({user, invitedBy: this.user._id}))}`,
                linkText: "Subscribe",
                buttonColor: "white"
            },
        })
    }

    public static async confirm(id: string): Promise<boolean> {
        // Sets confirmed to true
        const res = await User.updateOne({ id }, { confirmed: true })
        console.log(res);

        return res.acknowledged;
    }

    public async assignRole(id: string) {
        this.user.roles.push(id)
        await this.user.save();
    }

    public async update(id: string) {
       console.log('updating');
       
    }

    async checkPermissions(type: string, level: number) {
        console.log('hoi')
    }
}