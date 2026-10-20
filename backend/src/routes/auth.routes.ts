import { Router } from 'express';
import { login, logout, refresh, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { loginLimiter } from '../middlewares/rateLimit.js';

export const authRouter = Router();

authRouter.post('/login', loginLimiter, login);
authRouter.post('/logout', logout);
authRouter.post('/refresh', refresh);
authRouter.get('/me', authenticate, getMe);
