"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
router.get("/details", auth_1.authenticateToken, user_1.getUserDetails);
exports.default = router;
