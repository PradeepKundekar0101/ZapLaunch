import { NextFunction, Request, RequestHandler, Response } from "express";
import { ApiError } from "./ApiError";

const asyncHandler = (requestHandler: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await Promise.resolve(requestHandler(req, res, next));
      } catch (error:any) {
        if (error instanceof ApiError) {
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
  
  export { asyncHandler };