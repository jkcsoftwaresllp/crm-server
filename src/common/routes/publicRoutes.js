import express from "express";
import authRouter from "../../modules/User/v1/routes/authRoutes.js";
import companyRoutes from '../../modules/User/v1/routes/companyRoutes.js';
import { validatePhoneNumber } from '../utils/validation/validatePhone.js';
import { generalLimiter, authLimiter } from '../middlewares/rateLimiter.js';

const publicRouter = express.Router(); 

publicRouter.use('/v1/auth', authLimiter, authRouter);              
publicRouter.use('/v1/company', companyRoutes);        
publicRouter.use(generalLimiter);

export default publicRouter;