import dotenv from "dotenv";
dotenv.config();
export default {
    TEST: "TEST",
    SERVER_SECRET: process.env["SERVER_SECRET"],
    APP_ENV: process.env["APP_ENV"]
}