export * from "./Auth/index.js";
export * from "./Messages/index.js";
export * from "./User/index.js";
import { userRouter } from "./User/index.js";
import { authRouter } from "./Auth/index.js";
import { messageRouter } from "./Messages/index.js";

export const modules = [
  {
    path: "/api/v1/auth",
    router: authRouter,
    logFile: "auth.log",
  },
  {
    path: "/api/v1/user",
    router: userRouter,
    logFile: "user.log",
  },
  {
    path: "/api/v1/message",
    router: messageRouter,
    logFile: "message.log",
  },
];
