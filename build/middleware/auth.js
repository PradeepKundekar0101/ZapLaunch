"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("../utils/ApiError");
const JWT_SECRET = process.env.JWT_SECRET || "";
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new ApiError_1.ApiError(401, "Unauthorized");
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new ApiError_1.ApiError(401, "Unauthorized");
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            throw new ApiError_1.ApiError(403, "Forbidden");
        }
        req.userId = user.id;
        next();
    });
};
exports.authenticateToken = authenticateToken;
