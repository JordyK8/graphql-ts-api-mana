import dotenv from "dotenv"
import { logger } from '../utils/logging/logger';
import { IRole, Role } from "../utils/mongodb/models/Role.schema";
import { IUser, User, UUser } from "../utils/mongodb/models/User.schema";
dotenv.config();

export default class UserService{
  private user: IUser;
  constructor(user: IUser) {
    this.user = user;
  }

  public static async create(data: UUser): Promise<IUser> {
    try {
      return User.create(data);
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