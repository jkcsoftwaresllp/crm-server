import express from "express";
import authRouter from "../../modules/User/v1/routes/authRoutes.js";
import companyRoutes from '../../modules/User/v1/routes/companyRoutes.js';

const publicRouter = express.Router(); 

publicRouter.use('/auth', authRouter);              
publicRouter.use('/company', companyRoutes);        

export default publicRouter;
