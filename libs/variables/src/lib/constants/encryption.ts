import dotenv from "dotenv";
dotenv.config();
export default {
    CIPHER: process.env["ENCRYPTION_CIPHER"],
    KEY: process.env["ENCRYPTION_KEY"],
    SHA: process.env["ENCRYPTION_SHA"]
}