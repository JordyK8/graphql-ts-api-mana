const imgbbUploader = require("imgbb-uploader");
import { promises as fs } from "fs"
import dotenv from "dotenv"

dotenv.config();
export default class {
  public static upload(data: any | { name: string, data: Buffer, mimeType: string }) {
    return process.env.APP_ENV === 'production' ? this.uploadToGCS(data) : this.uploadToImbb(data.stream)
  }
  public static async uploadToImbb(fileStream: any) {    
    const streamToBase64 = (fileStream: any) => {
      const concat = require('concat-stream')
      const { Base64Encode } = require('base64-stream')
    
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
  public static async uploadToGCS(fileStream: any) {
    
  }
}