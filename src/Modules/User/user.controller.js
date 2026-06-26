import { Router } from "express";
import * as userService from './user.service.js'
import { authentication,authorization } from "../../Middlewares/authentication.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../Utils/enums/user.enum.js";
const router = Router();

router.get('/profile',
    authentication({TokenType : TokenTypeEnum.Access}),
    authorization({accessRoles:[RoleEnum.USER]}),
    userService.getProfile)

export default router;