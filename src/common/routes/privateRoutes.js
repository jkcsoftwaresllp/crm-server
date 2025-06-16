import express from "express";

const privateRouter = express.Router();

privateRouter.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Private routes are working' });
});

export default privateRouter;
