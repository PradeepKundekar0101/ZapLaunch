import { z } from 'zod';

export const userSchema = z.object({
    userName: z.string({
        required_error: "User Name is required"
    }).min(3, "User name must be at least 3 characters").max(26, "User name can be a maximum of 26 characters"),

    email: z.string({
        required_error: "Email is required"
    }).email("Invalid Email"),

    password: z.string({
        required_error: "Password is required"
    }).min(8, "Password must be at least 8 characters").regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});
