import { Router } from "express";
import UserModel from "../../DB/Models/user.model.js";
import * as authService from './auth.service.js'
import { authentication } from "../../Middlewares/authentication.middleware.js";
import { TokenTypeEnum } from "../../Utils/enums/user.enum.js";
const router = Router();
import jwt from 'jsonwebtoken'
import { validation } from "../../Middlewares/validation.middleware.js";
import * as authValidation from './auth.validation.js'

router.post('/signup',validation(authValidation.signupSchema),authService.signup)

router.post('/login',validation(authValidation.loginSchema),authService.login)

router.post('/refresh-token',
    authentication({tokenType:TokenTypeEnum.Refresh}),
    authService.refreshToken);

    router.post('/social-login',
    authService.loginWithGoogle);
export default router;