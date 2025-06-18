import express from 'express';
import rateLimiter from '../../../../../../middleware/rateLimiter.js';
import { login, register } from '../controllers/authController.js';

const router = express.Router();

// Login: max 5 requests per minute
router.post('/login', rateLimiter({ windowMs: 60 * 1000, max: 5 }), login);

// Register: max 20 requests per hour
router.post('/register', rateLimiter({ windowMs: 60 * 60 * 1000, max: 20 }), register);

export default router;
