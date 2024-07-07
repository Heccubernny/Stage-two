import { Router } from 'express';
import UserController from '../controllers/userController';
import AuthMiddleware from '../middleware/auth';

const router = Router();

router.get('/:id', AuthMiddleware.authenticateJWT, UserController.getUser);

export default router;
