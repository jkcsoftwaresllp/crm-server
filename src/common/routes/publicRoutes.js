import express from "express";
import authRouter from "../../modules/User/v1/routes/authRoutes.js";
import companyRoutes from '../../modules/User/v1/routes/companyRoutes.js';
import { validatePhoneNumber } from '../utils/validation/validatePhone.js';
import { errorHandler } from '../middlewares/errorHandler.js';

const publicRouter = express.Router(); 

publicRouter.use('/v1/auth', authRouter);              
publicRouter.use('/v1/company', companyRoutes);      
publicRouter.use(errorHandler);

export default publicRouter;
