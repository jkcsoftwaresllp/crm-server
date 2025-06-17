import express from "express";
import authRouter from "../../modules/User/v1/routes/authRoutes.js";
import comRoutes from '../../modules/User/v1/routes/comRoutes.js';

const publicRouter = express.Router();

publicRouter.use('/v1/auth', authRouter);
publicRouter.use('/v1/com', comRoutes); 
export default publicRouter;