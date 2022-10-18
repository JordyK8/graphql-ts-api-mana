import dotenv from "dotenv"
import { logger } from '../utils/logging/logger';
import UploadModule from "../utils/modules/UploadModule";
import { IRole, Role } from "../utils/mongodb/models/Role.schema";
import { IUser, User, UUser } from "../utils/mongodb/models/User.schema";
dotenv.config();

export default class UserService{
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

  public async assignRole(id: string) {
    this.user.roles.push(id)
    await this.user.save();
  }

  async checkPermissions(type: string, level: number) {
    
  }
}