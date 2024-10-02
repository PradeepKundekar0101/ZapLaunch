"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserRegistration = exports.validateProject = void 0;
const zod_1 = require("zod");
const validateProject = (schema) => (req, res, next) => {
    try {
        const { gitUrl, projectName } = req.body;
        schema.parse({ gitUrl, projectName });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ success: false, message: error.errors[0].message });
        }
        else {
            console.error("Error during validation:", error);
            res
                .status(500)
                .json({ success: false, error: "Internal server error" });
        }
    }
};
exports.validateProject = validateProject;
const validateUserRegistration = (schema) => (req, res, next) => {
    try {
        const { userName, email, password } = req.body;
        schema.parse({ userName, email, password });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ success: false, message: error.errors[0].message });
        }
        else {
            console.error("Error during validation:", error);
            res
                .status(500)
                .json({ success: false, error: "Internal server error" });
        }
    }
};
exports.validateUserRegistration = validateUserRegistration;
