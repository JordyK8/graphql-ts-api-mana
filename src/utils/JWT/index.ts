import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export default class JWT {

    public static async sign(content: any): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(content, process.env.JWT_TOKEN_SECRET as string, (err: any, token: any) => {
                if (err !== null) reject(err);
                else resolve(token);
            });
        });
    }

    public static async decipher(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_TOKEN_SECRET as string, (err, decoded) => {
                if (err !== null) reject(err);
                else resolve(decoded);
            });
        });
    }

}
