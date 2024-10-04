import { Request } from "express";
// import { IUser } from "../model/user";
export interface CustomRequest extends Request{
    user?: any
}