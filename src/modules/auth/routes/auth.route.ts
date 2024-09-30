import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authValidator } from '../validators';
import { sessionAuth } from '../../../middleware/authorize-user';
import userRateLimiter from '../../../middleware/limiter';

const router = express();

router.post(
  '/register/users',
  authValidator.register,
  AuthController.registerUser,
);
router.post(
  '/register/admins',
  authValidator.register,
  AuthController.registerAdmin,
);
router.post('/login', authValidator.login, AuthController.login);
router.post('/logout', sessionAuth, userRateLimiter, AuthController.logout);

export const AuthRoutes = router;
