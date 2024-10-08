import express from "express";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";
import projectRoute from "./routes/project";
import userRoute from "./routes/user";
import authRoute from "./routes/auth";
import analytics from "./routes/analytics";

dotenv.config();
export const app = express();
app.use(passport.initialize());
app.get("/", (req, res) => {
  res.send("Hello from launch pilot");
});
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/api/v1/project", projectRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/analytics", analytics);
