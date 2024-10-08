import express from "express";
import passport from "passport";

import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "";

const router = express.Router();
router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`https://zaplaunch.tech/auth-callback?token=${token}`);
    // res.redirect(`http://localhost:5173/auth-callback?token=${token}`);
  }
);
const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};
export default router;
