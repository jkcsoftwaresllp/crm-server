import express from "express";
import authRouter from "../../modules/User/v1/routes/authRoutes.js";
<<<<<<< HEAD
import approvalRoutes from '../../modules/User/v1/routes/approvalRoutes.js';
=======
import companyRoutes from '../../modules/User/v1/routes/companyRoutes.js';
>>>>>>> b59c22acd91338fa980fc476b00cf542e2544736

const publicRouter = express.Router(); 

<<<<<<< HEAD
publicRouter.use('/v1/auth', authRouter);
publicRouter.use('/v1/platform', approvalRoutes);
export default publicRouter;
=======
publicRouter.use('/v1/auth', authRouter);              
publicRouter.use('/v1/company', companyRoutes);        

export default publicRouter;
>>>>>>> b59c22acd91338fa980fc476b00cf542e2544736
