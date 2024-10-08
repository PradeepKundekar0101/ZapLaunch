import express from "express";
import passport from "passport";

import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "";
import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();
const router = express.Router();
router.get("/guestLogin", async (req, res) => {
  try {
    const guestUser = await prismaClient.user.findFirst({
      where: { githubId: process.env.GUEST_USER_ID },
    });
    if (!guestUser) {
      return res.status(404).json({ error: "Guest user not found" });
    }

    const token = generateToken(guestUser);
    res.json({guestUser, token });
  } catch (error) {
    console.error("Error in guest login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", { session: true }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`https://zaplaunch.tech/auth-callback?token=${token}`);
  }
);
router.get('/signout', (req, res) => {
  try {
    req.session.destroy(function (err) {
      console.log('session destroyed.');
    });
    res.send('Done');
  } catch (err) {
    res.status(400).send({ message: 'Failed to sign out fb user' });
  }
});
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
