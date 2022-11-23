import { imgbbUploader } from "imgbb-uploader";
import concat from 'concat-stream';
import { Base64Encode } from 'base64-stream';
import dotenv from "dotenv"
import { FileUpload } from "graphql-upload-ts";
import { logging as logger } from "@my-foods2/logging";
import  { Storage } from '@google-cloud/storage';

dotenv.config();
export class UploadModule {
  /**
   * Upload file to eigther imbb or gcs depending on the environment
   * @param data 
   * @returns 
   */
  public static upload(type: 'gcs'|'imgbb' ,data: any | { name: string, data: Buffer, mimeType: string }): Promise<string> {
    return type === 'gcs' ? this.uploadToGCS(data) : this.uploadToImbb(data.stream)
  }
  public static graphQlUpload(image: any) {
    return process.env.APP_ENV === 'production'
      ? this.upload('gcs', image)
      : new Promise((resolve, reject) => {
      image.then(async (f: FileUpload) => {
        try {
          const body = f.createReadStream();
          await this.upload('imgbb', body);
          resolve(true);
        } catch (e) {
          logger.error(e)
          reject("Something went wrong with creating new product.");
        }
      })
    });
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
    const bucketName = "node-graphql-application"; // our bucket name
    const storage = new Storage({ keyFilename: `${__dirname}/secret.json` });

    const { filename, createReadStream } = await fileStream;

    const sanitizedName = filename.trim();
    return new Promise((resolve, reject) => {
      createReadStream().pipe(
        storage
          .bucket(bucketName)
          .file(sanitizedName)
          .createWriteStream()
          .on("finish", () => {
            storage
              .bucket(bucketName)
              .file(sanitizedName)

           // make the file public
              .makePublic() 
              .then(() => resolve(`https://storage.googleapis.com/${bucketName}/${sanitizedName}`))
              .catch((e: any) => {
                reject(e);
              });
          })
      );
    });
  }
}