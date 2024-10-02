"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const userSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "User Name is required"
    }).min(3, "User name must be atleast 3 characters").max(26, "User name can be maximum of 26 characters"),
    email: zod_1.z.string({
        required_error: "Email is required"
    })
        .email("Invalid Email")
});
