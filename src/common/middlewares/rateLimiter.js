// Simple in-memory store for IP tracking
const ipStore = new Map();

// Factory to create rate limiters with custom config
export const createRateLimiter = ({ windowMs = 60 * 60 * 1000, max = 100 } = {}) => {
  return (req, res, next) => {
    const now = Date.now();
    const ip = req.ip;

    if (!ipStore.has(ip)) {
      ipStore.set(ip, []);
    }

    const timestamps = ipStore.get(ip).filter(ts => now - ts < windowMs);
    timestamps.push(now);
    ipStore.set(ip, timestamps);

    const remaining = max - timestamps.length;

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, remaining));
    res.setHeader('X-RateLimit-Reset', Math.ceil((timestamps[0] + windowMs) / 1000));

    if (timestamps.length > max) {
      const retryAfter = Math.ceil((timestamps[0] + windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({ message: 'Too many requests, try again later.' });
    }

    next();
  };
};

// Common prebuilt profiles
export const generalLimiter = createRateLimiter();                // 100/h
export const authLimiter = createRateLimiter({ max: 20 });        // 20/h
export const strictLimiter = createRateLimiter({ max: 5 });       // 5/h