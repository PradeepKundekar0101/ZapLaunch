"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    userName: zod_1.z.string({
        required_error: "User Name is required"
    }).min(3, "User name must be at least 3 characters").max(26, "User name can be a maximum of 26 characters"),
    email: zod_1.z.string({
        required_error: "Email is required"
    }).email("Invalid Email"),
    password: zod_1.z.string({
        required_error: "Password is required"
    }).min(8, "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});
