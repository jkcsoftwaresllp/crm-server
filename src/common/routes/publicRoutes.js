import express from "express";
import authRouter from "../../modules/User/v1/routes/authRoutes.js";

const publicRouter = express.Router();

publicRouter.use('/v1/auth', authRouter);

export default publicRouter;
