// IMPORTS
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import publicRoutes from "./src/common/routes/publicRoutes.js";
import privateRoutes from "./src/common/routes/privateRoutes.js";
import auth from "./src/common/middlewares/authenticate.js";
import * as logger from "./src/common/logger/loggerSetup.js";

// SETUP
config();
const server = express();
const PORT = process.env.PORT || 8000;
const allowedOrigins = [
  "http://localhost:3000",
];
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      logger.warn('CORS policy violation', { origin, component: 'cors-middleware' });
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200,
};

// MIDDLEWARES
server.use(express.json());
server.disable("x-powered-by");
server.use(cors(corsOptions));

// ROUTES
server.use('/api/public', publicRoutes);
server.use('/api', auth, privateRoutes);

// START
server.listen(PORT, () => {
  logger.info('CRM Backend server started', { 
    port: PORT, 
    database: process.env.DB_NAME || 'crm',
    environment: process.env.NODE_ENV || 'development',
    component: 'server-startup'
  });
});
