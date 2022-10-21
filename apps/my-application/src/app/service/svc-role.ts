import dotenv from "dotenv"
import { logger } from '../utils/logging/logger';
import { IRole, Role } from "../utils/mongodb/models/Role.schema";
dotenv.config();

export default class RoleService{
  constructor() {

  }

  public static async create(name: string, permissions: string[]): Promise<IRole> {
    try {
      return Role.create({
        name,
        permissions,
      });
    } catch (e) {
      logger.error(e)
      throw new Error("Somethind went wrong with fetching product.")
    }
  }
}