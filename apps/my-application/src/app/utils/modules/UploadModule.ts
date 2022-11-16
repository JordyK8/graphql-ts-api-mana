import { imgbbUploader } from "imgbb-uploader";
import concat from 'concat-stream';
import { Base64Encode } from 'base64-stream';
import dotenv from "dotenv"

dotenv.config();
export default class {
  /**
   * Upload file to eigther imbb or gcs depending on the environment
   * @param data 
   * @returns 
   */
  public static upload(data: any | { name: string, data: Buffer, mimeType: string }): Promise<string> {
    return process.env.APP_ENV === 'production' ? this.uploadToGCS(data) : this.uploadToImbb(data.stream)
  }
  
  /**
   * Upload file to Imbb and return url
   * @param fileStream 
   * @returns 
   */
  public static async uploadToImbb(fileStream: any): Promise<string> {    
    const streamToBase64 = (fileStream: any) => {
    
      return new Promise((resolve, reject) => {
        const base64 = new Base64Encode()
    
        const cbConcat = (base64: any) => {
          resolve(base64)
        }
    
        fileStream
          .pipe(base64)
          .pipe(concat(cbConcat))
          .on('error', (error: any) => {
            reject(error)
          })
      })
    }
    const data = await streamToBase64(fileStream)
    
    const options = {
      apiKey: process.env.IMGBB_API_KEY, // MANDATORY
      base64string: data
    };
    const res = await imgbbUploader(options)
    const url = res.url;
    return url;
  }
  
  /**
   * Upload file to GCS and return url
   * @param fileStream 
   * @returns 
   */
  public static async uploadToGCS(fileStream: any): Promise<string> {
    return "hoi"
  }
}