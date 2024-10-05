import express from 'express';
import { userSchema } from '../validationSchema/user';
import { validateUserRegistration } from '../middleware/zodValidators';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { getUserDetails } from '../controllers/user';

const router = express.Router();

router.get("/details",authenticateToken,getUserDetails)


export default router