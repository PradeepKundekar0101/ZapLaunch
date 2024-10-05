import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";
const prisma = new PrismaClient();

export const getUserDetails = asyncHandler(async(req:AuthRequest,res)=>{
    const userId = req.userId;
    const user = await prisma.user.findFirst({where:{id:userId}})
    if(!user)
        throw new ApiError(404,"User not found");
    res.json({user}).status(200)
})

