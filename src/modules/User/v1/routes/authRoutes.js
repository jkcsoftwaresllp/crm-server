import express from "express";
import * as authController from "../controllers/authController.js";
import { verifyEmail } from "../controllers/emailVerificationController.js";
// import rateLimiter from "../../../../../../middleware/rateLimiter.js";

const router = express.Router();

router.post(
  "/signup",
//   rateLimiter({ windowMs: 60 * 60 * 1000, max: 20 }),
  authController.signup
);
router.post(
  "/login",
//   rateLimiter({ windowMs: 60 * 1000, max: 5 }),
  authController.login
);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/verify-email", verifyEmail);

export default router;
