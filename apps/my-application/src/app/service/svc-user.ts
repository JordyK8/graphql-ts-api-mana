import dotenv from "dotenv"
import UserInputInvite from "../graphql/users/Interfaces";
import { Crypt } from "@my-foods2/crypt"
import { logging as logger } from "@my-foods2/logging";
import MailModule from "../utils/modules/MailModule";
import UploadModule from "../utils/modules/UploadModule";
import { IRole, Role } from "../utils/mongodb/models/Role.schema";
import { IUser, User, UUser } from "../utils/mongodb/models/User.schema";
dotenv.config();

export default class UserService {
    private user: IUser;
    constructor(user: IUser) {
        this.user = user;
    }

    public static async register(user: any): Promise<IUser> {
        const uploadImageToImbb = async () => user.image.then(async (f: any) => {
            try {
                const body = f.createReadStream();
                return UploadModule.uploadToImbb(body);
            } catch (e) {
                logger.error(e)
                throw new Error("Something went wrong with creating new product.");
            }
        })
        user.image = await uploadImageToImbb()
        try {
            return User.create(user);
        } catch (e) {
            logger.error(e)
            throw new Error("Somethind went wrong with fetching product.")
        }
    }

    public static async invite(user: UserInputInvite, hook: string): Promise<boolean> {
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
        const res = await User.updateOne({ id }, { confirmed: true })
        console.log(res);

        return res.acknowledged;
    }

    public async assignRole(id: string) {
        this.user.roles.push(id)
        await this.user.save();
    }

    public async update(id: string) {
        this.user.roles.push(id)
        await this.user.save();
    }


    async checkPermissions(type: string, level: number) {
        console.log('hoi')
    }
}