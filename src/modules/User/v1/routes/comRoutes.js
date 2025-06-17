import express from 'express';
import { registerComController } from '../controllers/comController.js';

const router = express.Router();

// Route: POST /api/com/register
router.post('/register', registerComController);

export default router;