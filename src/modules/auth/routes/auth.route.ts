import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authValidator } from '../validators';

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

export const AuthRoutes = router;
