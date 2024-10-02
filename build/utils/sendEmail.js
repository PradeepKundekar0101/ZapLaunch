"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ApiError_1 = require("./ApiError");
const pass = process.env.EMAIL_PASSWORD;
const user = process.env.EMAIL_USERNAME;
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: "login",
        user,
        pass
    },
    tls: {
        ciphers: "SSLv3",
    },
});
const sendmail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
    }
    catch (err) {
        throw new ApiError_1.ApiError(400, err.message);
    }
};
exports.sendmail = sendmail;
