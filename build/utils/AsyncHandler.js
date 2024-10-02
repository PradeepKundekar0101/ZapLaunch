"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const ApiError_1 = require("./ApiError");
const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await Promise.resolve(requestHandler(req, res, next));
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                return res.status(error.statusCode).json({
                    message: error.message,
                    success: false,
                    errors: error.errors,
                });
            }
            next(error);
        }
    };
};
exports.asyncHandler = asyncHandler;
