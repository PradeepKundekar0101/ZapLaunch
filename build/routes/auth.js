"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "";
const router = express_1.default.Router();
router.get("/github", passport_1.default.authenticate("github"));
router.get("/github/callback", passport_1.default.authenticate("github", { session: false }), (req, res) => {
    console.log(req.user);
    const token = generateToken(req.user);
    res.redirect(`http://localhost:5173/auth-callback?token=${token}`);
});
const generateToken = (user) => {
    console.log("JWT_SECRET");
    console.log(JWT_SECRET);
    return jsonwebtoken_1.default.sign({
        id: user.id,
    }, JWT_SECRET, { expiresIn: "7d" });
};
exports.default = router;
