"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectSchema = void 0;
const zod_1 = require("zod");
const GitUrlRegex = /^(?:git|https?|git@)(:\/\/|:\/\/(?:[^@\/\n]+@)?)([\w.-]+)(?::|\/)([^\/\n]+\/[^\/\n]+)(?:\.git)?$/;
exports.projectSchema = zod_1.z.object({
    projectName: zod_1.z
        .string({
        required_error: "Project Name is requried",
    })
        .trim()
        .min(6, "Project Name must be atleast 6 character")
        .max(100, "Project Name must not exceed 100 character"),
    gitUrl: zod_1.z
        .string({
        required_error: "Git Hub URL is required",
    })
        .trim()
        .regex(GitUrlRegex, { message: "Invalid github url" }),
});
