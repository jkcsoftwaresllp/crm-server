import express from 'express';
import rateLimiter from './src/common/middlewares/rateLimiter.js';

const app = express();
app.use(express.json());

// Apply rate limiter (5 req per minute for testing)
app.post('/test', rateLimiter({ windowMs: 60 * 1000, max: 5 }), (req, res) => {
  res.json({ message: 'Request successful ✅' });
});

app.listen(4000, () => {
  console.log('Test server running at http://localhost:4000');
});
