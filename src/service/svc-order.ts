import dotenv from "dotenv"
import { logger } from '../utils/logging/logger';
import PaymentModule from "../utils/modules/PaymentModule";
import { IOrder, Order } from "../utils/mongodb/models/Order.schema";
import { IProduct } from "../utils/mongodb/models/Product.schema";
dotenv.config();

export default class OrderService {
  constructor() {

  }

  public static async create(cart: any[]): Promise<any> {
    try {
      const products = cart.reduce((acc, product) => {
        if (product.amount) {
          for (let i = 0; i < product.amount; i++) {
            acc.push(product);
          }
        } else acc.push(product);
        return acc;
      }, []);
      console.log(products);
      
      const order = await Order.create({
        items: products.map((i: IProduct) => i._id),
        status: 0,
        email: "jordykokelaar@gmail.com",
      })
      console.log(order);
      const info = await this.checkout(products, order._id);
      console.log(info);
      
      return info;
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