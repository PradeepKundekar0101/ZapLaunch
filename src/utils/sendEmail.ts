import nodemailer from "nodemailer";
import { ApiError } from "./ApiError";

const pass = process.env.EMAIL_PASSWORD as string;
const user = process.env.EMAIL_USERNAME as string;

const transporter = nodemailer.createTransport({
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

export interface IMailOptions {
  from: {
    name: string;
    address: string;
  };
  to: string;
  subject: string;
  html: string;
}

export const sendmail = async (mailOptions: IMailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
  } catch (err: any) {
    throw new ApiError(400, err.message);
  }
};