import dotenv from "dotenv"
import { logger } from '../utils/logging/logger';
import PaymentModule from "../utils/modules/PaymentModule";
import { IProduct } from "../utils/mongodb/models/Product.schema";
dotenv.config();

export default class OrderService {
  constructor() {

  }

  public static async create(cart: any[]): Promise<any> {
    try {
      
    } catch (e) {
      logger.error(e)
      throw new Error("Something went wrong with updating product.")
    }
  }
  private static async checkout(products: IProduct[], id: string) {
    const value: number = products.reduce((acc: number, i: IProduct): number => {
      acc = + i.price
      return acc
    }, 0)
    const payment = new PaymentModule()
    return payment.checkout(value.toString(), 'EUR', id, "order")
  }
}