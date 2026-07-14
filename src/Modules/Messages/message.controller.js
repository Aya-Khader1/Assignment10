import { Router } from "express";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as messageValidation from "./message.validation.js";
import * as messageService from "./message.service.js";
import { TokenTypeEnum } from "../../Utils/enums/user.enum.js";
import { authentication } from "./../../Middlewares/authentication.middleware.js";
const router = Router();

router.post(
  "/send-message/:receiverId",
  validation(messageValidation.sendMessgeSchema),
  messageService.sendMessage,
);

router.get(
  "/",

  authentication({ tokenType: TokenTypeEnum.Access }),

  messageService.getMessage,
);

router.patch(
  "/:messageId/read",

  authentication({ tokenType: TokenTypeEnum.Access }),
  validation(messageValidation.toggleReadSchema),

  messageService.toggleRead,
);
router.patch(
  "/:messageId/favorite",

  authentication({ tokenType: TokenTypeEnum.Access }),
  validation(messageValidation.toggleFavoritesSchema),

  messageService.toggleFavorites,
);
export default router;
