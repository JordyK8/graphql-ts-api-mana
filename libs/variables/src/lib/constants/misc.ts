import dotenv from "dotenv";
dotenv.config();
export default {
    TEST: "TEST",
    SERVER_SECRET: process.env["SERVER_SECRET"],
    APP_ENV: process.env["APP_ENV"],
    business: {
        user: {
            roles: {
                owner: "business_owner",
                manager: "business_manager",
                content_manager: "business_content_manager",
                employee: "business_employee"
            },
            permissions: {
                "business_owner": {
                    reviews: ["read", "write", "delete", "full"],
                    users: ["read", "write", "delete", "full"],
                    businessUsers: ["read", "write", "delete", "full"],
                    business: ["read", "write", "delete", "full"],
                    menu: ["read", "write", "delete", "full"],
                },
                "business_manager": {
                    reviews: ["read", "write", "delete", "full"],
                    users: ["read", "write", "delete", "full"],
                    businessUsers: ["read", "write", "delete", "full"],
                    business: ["read", "write", "delete", "full"],
                    menu: ["read", "write", "delete", "full"],
                },
                "business_content_manager": {
                    reviews: ["read", "write", "delete", "full"],
                    users: ["read", "write", "delete", "full"],
                    businessUsers: ["read", "write", "delete", "full"],
                    business: ["read", "write", "delete", "full"],
                    menu: ["read", "write", "delete", "full"],
                },
                "business_employee": {
                    reviews: ["read"],
                    users: ["read"],
                    businessUsers: ["read"],
                    business: ["read"],
                    menu: ["read"],
                },
            }
        }
    },
    pagination: {
        businessFindNearyLimit: 20,
    }

}