"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDetails = void 0;
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApiError_1 = require("../utils/ApiError");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "";
exports.getUserDetails = (0, AsyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.userId;
    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user)
        throw new ApiError_1.ApiError(404, "User not found");
    res.json({ user }).status(200);
});
// export const registerUser = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { email, userName, password } = req.body;
//     if (!email || !password || !userName)
//       throw new ApiError(400, "All fields are required");
//     const existingUser = await prisma.user.findFirst({
//       where: {
//         email,
//       },
//     });
//     if (existingUser) {
//       throw new ApiError(409, "User with email already exists");
//     }
//     const hashPass = await bcrypt.hash(password, 10);
//     const user = await prisma.user.create({
//       data: {
//         userName,
//         email,
//         password: hashPass,
//       },
//     });
//     const token = jwt.sign({ id: user.id }, JWT_SECRET);
//     if (!user)
//       throw new ApiError(500, "Something went wrong while creating a user");
//     const emailToken = randomBytes(18).toString("hex");
//     await prisma.emailToken.create({
//       data: {
//         userId: user.id,
//         token: emailToken,
//       },
//     });
//     await sendmail({
//       subject: "Welcome to Launch Pilot",
//       to: user.email,
//       from:{
//         name:"Pradeep Kundekar",
//         address:"pradeepkundekar1010@gmail.com"
//       }
//       ,
//       html: getInvitationHTMlTemplate(
//         user.id,
//         user.userName,
//         emailToken
//       ),
//     });
//     return res
//       .status(201)
//       .json(new ApiResponse(201, "User created", { user, token }, true));
//   }
// );
// export const loginUser = asyncHandler(async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   if (!email || !password) throw new ApiError(400, "All fields are required");
//   const existedUser = await prisma.user.findUnique({
//     where: {
//       email,
//     },
//   });
//   if (!existedUser) {
//     throw new ApiError(400, "Invalid credentials");
//   }
//   const passwordCorrect = await bcrypt.compare(password, existedUser.password);
//   if (!passwordCorrect) throw new ApiError(400, "Invalid credentials");
//   const token = jwt.sign({ id: existedUser.id }, JWT_SECRET, {
//     expiresIn: "7D",
//   });
//   return res
//     .status(201)
//     .json(
//       new ApiResponse(201, "User logged in", { user: existedUser, token }, true)
//     );
// });
// export const changePassword = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { curPassword, newPassword } = req.body;
//     if (!curPassword || !newPassword)
//       throw new ApiError(400, "All fields are required");
//     const userId = req.params.userId;
//     const existedUser = await prisma.user.findUnique({
//       where: {
//         id: userId,
//       },
//     });
//     if (!existedUser) {
//       throw new ApiError(404, "User not found");
//     }
//     const passwordCorrect = await bcrypt.compare(
//       curPassword,
//       existedUser.password
//     );
//     if (!passwordCorrect) throw new ApiError(400, "Invalid current password");
//     const hashNewPassword = await bcrypt.hash(newPassword, 10);
//     await prisma.user.update({
//       where: {
//         id: userId,
//       },
//       data: {
//         password: hashNewPassword,
//       },
//     });
//     return res
//       .status(201)
//       .json(
//         new ApiResponse(201, "Password Changed", { message: "Success" }, true)
//       );
//   }
// );
// export const verifyToken = asyncHandler(async (req: Request, res: Response) => {
//   const userId = req.params.userId;
//   const token = req.params.token;
//   const existedUser = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//   });
//   if (!existedUser) {
//     throw new ApiError(404, "User not found");
//   }
//   const existingToken = await prisma.emailToken.findUnique({
//     where: {
//       token,
//       userId,
//     },
//   });
//   if (!existingToken) throw new ApiError(400, "Invalid Email Token");
//   const currentTime = new Date();
//   const tokenCreationTime = new Date(existingToken.createdAt);
//   const expirationTime = new Date(tokenCreationTime.getTime() + 60 * 60 * 1000);
//   if (currentTime > expirationTime) throw new ApiError(400, "Token expired");
//   await prisma.user.update({
//     where: {
//       id: userId,
//     },
//     data: {
//       isEmailVerified: true,
//     },
//   });
//   await prisma.emailToken.delete({ where: { id: existingToken.id } });
//   return res
//     .status(201)
//     .json(new ApiResponse(201, "Email Verified", { message: "Success" }, true));
// });
// export const sendToken = asyncHandler(async (req: Request, res: Response) => {
//   const userId = req.params.userId;
//   const existedUser = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//   });
//   if (!existedUser) {
//     throw new ApiError(404, "User not found");
//   }
//   await prisma.emailToken.deleteMany({ where: { userId } });
//   const newEmailToken = await prisma.emailToken.create({
//     data: {
//       userId,
//       token: randomBytes(18).toString("hex"),
//     },
//   });
//   await sendmail({
//     subject: "Welcome to Launch Pilot",
//     to: existedUser.email,
//     from:{
//       name:"Pradeep Kundekar",
//       address:"pradeepkundekar1010@gmail.com"
//     }
//     ,
//     html: getInvitationHTMlTemplate(
//       userId,
//       existedUser.userName,
//       newEmailToken.token
//     ),
//   });
//   return res
//     .status(201)
//     .json(new ApiResponse(201, "Email sent", { message: "Success" }, true));
// });
