import rateLimit from 'express-rate-limit';

const userRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each user to 100 requests per windowMs
  keyGenerator: (req) => {
    return req.session?.user?._id || req.ip;
  },
  message: 'Too many requests from this user, please try again later.',
});

export default userRateLimiter;
