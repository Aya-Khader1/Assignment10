import { Router } from "express";
import UserModel from "../../DB/Models/user.model.js";
import * as authService from './auth.service.js'
const router = Router();

router.post('/signup',authService.signup)
router.get('/login',authService.login)


export default router;