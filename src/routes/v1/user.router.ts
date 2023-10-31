import { Router } from "express";
import UserController from "../../controllers/UserController.controller"
const router = Router();
router.post('/login',UserController.Login)
router.post('/register',UserController.Register)
router.get('/refreshToken',UserController.RefreshToken)

export default router