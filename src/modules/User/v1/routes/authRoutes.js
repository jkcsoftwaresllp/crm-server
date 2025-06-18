import express from "express";
import * as authController from "../controllers/authController.js";
import { verifyEmail } from "../controllers/emailVerificationController.js";

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.post("/verify-email", verifyEmail);

export default router;
