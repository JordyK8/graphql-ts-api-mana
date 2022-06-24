import { Product, IProduct } from '../utils/mongodb/models/Product.schema';
import dotenv from "dotenv"
import UploadModule from '../utils/modules/UploadModule';
import { logger } from '../utils/logging/logger';
dotenv.config();

export default class ProductService{
  constructor() {

  }

  public static async getProduct(id: string): Promise<IProduct | null> {
    try {
      return Product.findOne({ _id: id });
    } catch (e) {
      logger.error(e)
      throw new Error("Somethind went wrong with fetching product.")
    }
  }

  public static async getProductList(category?: string): Promise<IProduct[]> {
    try {
      return Product.find({ category });
    } catch (e) {
      logger.error(e)
      throw new Error("Something went wrong with fetching products.");
    }
  }

  public static async createProduct(product: any): Promise<IProduct> {
    const uploadImageToImbb = async () => product.image.then(async (f: any) => {
      try {
      const body = f.createReadStream();
      return UploadModule.uploadToImbb(body);

      } catch (e) {
        logger.error(e)
        throw new Error("Something went wrong with creating new product.");
      }
    })
    const url = await uploadImageToImbb()
    
    return Product.create({
      name: "test",
      price: 991,            
      image: url
    })
  }

  public static async updateProduct(product: IProduct): Promise<IProduct | null> {
    try {
      return Product.findOneAndUpdate({ _id : product._id }, product, {new : true});
    } catch (e) {
      logger.error(e)
      throw new Error("Something went wrong with updating product.")
    }
  }
}