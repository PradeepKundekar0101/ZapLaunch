import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

type SchemaType = z.ZodObject<any>;
declare global {
  namespace Express {
    interface Request {
      validatedData?: z.infer<SchemaType>;
    }
  }
}

export const validateProject =
  (schema: SchemaType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const { gitUrl, projectName } = req.body;
      schema.parse({ gitUrl, projectName });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ success: false, message: error.errors[0].message });
      } else {
        console.error("Error during validation:", error);
        res
          .status(500)
          .json({ success: false, error: "Internal server error" });
      }
    }
  };

  export const validateUserRegistration =
  (schema: SchemaType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userName, email,password} = req.body;
      schema.parse({ userName, email,password });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ success: false, message: error.errors[0].message });
      } else {
        console.error("Error during validation:", error);
        res
          .status(500)
          .json({ success: false, error: "Internal server error" });
      }
    }
  };

