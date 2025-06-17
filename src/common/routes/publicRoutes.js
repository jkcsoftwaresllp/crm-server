import express from "express";
import authRouter from "../../modules/User/v1/routes/authRoutes.js";
import approvalRoutes from '../../modules/User/v1/routes/approvalRoutes.js';

const publicRouter = express.Router();

publicRouter.use('/v1/auth', authRouter);
publicRouter.use('/v1/platform', approvalRoutes);
export default publicRouter;