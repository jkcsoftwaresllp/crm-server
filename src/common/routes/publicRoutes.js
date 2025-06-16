import express from "express";
const publicRouter = express.Router(); 

import authRouter from "../../modules/User/v1/routes/authRoutes.js";
import companyRoutes from '../../modules/User/v1/routes/companyRoutes.js';

publicRouter.use('/v1/auth', authRouter);
publicRouter.use('/company', companyRoutes); 

export default publicRouter;
