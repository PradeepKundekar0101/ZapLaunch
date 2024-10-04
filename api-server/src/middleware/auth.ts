import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken"
import { ApiError } from '../utils/ApiError';
const JWT_SECRET = process.env.JWT_SECRET ||"";

export interface AuthRequest extends Request {
    headers: {
        authorization?: string; 
    };
    userId?:string
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new ApiError(401,"Unauthorized");
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new ApiError(401,"Unauthorized");
    }

    jwt.verify(token, JWT_SECRET, (err, user:any) => {
        if (err) {
            throw new ApiError(403,"Forbidden");
        }
        req.userId = user.id;
        next();
    });

};
