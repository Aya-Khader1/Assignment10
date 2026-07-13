import { Router } from "express";
import * as userService from "./user.service.js";
import {
  authentication,
  authorization,
} from "../../Middlewares/authentication.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../Utils/enums/user.enum.js";
import {
  fileValidation,
  localFileUpload,
  magicNumberValidation,
} from "../../Utils/multer/local.multer.js";
import * as userValidation from "./user.validation.js";
import { validation } from "../../Middlewares/validation.middleware.js";
const router = Router();

router.get(
  "/profile",
  authentication({ TokenType: TokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.USER, RoleEnum.ADMIN] }),
  userService.getProfile,
);

router.patch(
  "/upload-file",
  authentication({ TokenType: TokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.USER] }),
  localFileUpload({
    customPath: "users",
    validation: [...fileValidation.images, ...fileValidation.documents],
  }).single("attachments"),
  magicNumberValidation,

  userService.updateProfilePic,
);

router.patch(
  "/upload-cover-files",
  authentication({ TokenType: TokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.USER] }),
  magicNumberValidation,
  localFileUpload({
    customPath: "users",
    validation: [...fileValidation.images],
  }).array("attachments", 5),
  userService.updateCoverPictures,
);

router.patch(
  "/update-password",
  authentication({ TokenType: TokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.USER] }),
  validation(userValidation.updatePasswordSchema),
  userService.updatePassword,
);

router.patch(
  "{/:userId}/freeze-account",
  authentication({ TokenType: TokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.USER, RoleEnum.ADMIN] }),
  validation(userValidation.freezeSchema),
  userService.freezeAccount,
);

router.patch(
  "{/:userId}/restore-account",
  authentication({ TokenType: TokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.USER] }),
  validation(userValidation.freezeSchema),
  userService.restoredAccount,
);

router.patch(
  "/:userId/hard-delete-account",
  authentication({ TokenType: TokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.ADMIN] }),
  validation(userValidation.hardDeleteSchema),
  userService.hardDeleteAccount,
);
export default router;
