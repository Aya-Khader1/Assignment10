import connectDB from "./DB/connection.js";
import { userRouter, authRouter, messageRouter } from "./Modules/index.js";
import { sendEmail } from "./Utils/email/email.utils.js";
import {
  globalErrorHandler,
  NotFoundException,
} from "./Utils/response/error.response.js";
import { successResponse } from "./Utils/response/success.response.js";
import cors from "cors";

import path from "node:path";
import { rateLimit } from "express-rate-limit";
import { corsOption } from "./Utils/cors/cors.util.js";
import helmet from "helmet";
import morgan from "morgan";
import { attachRouterWithLogger } from "./Utils/loggers/morgan.logger.js";
import { customRateLimiter } from "./Middlewares/rate-limit.js";
import { modules } from "./Modules/index.js";
import { redisConnection } from "./DB/redis-connection.js";
const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 3,
  handler: (req, res) => {
    return res
      .status(429)
      .json({ message: "Too Many Requests,please try again later" });
  },
  legacyHeaders: false,
});

const bootstrap = async (app, express) => {
  app.use(
    express.json(),
    morgan(),
    cors(corsOption()),
    helmet(),
    customRateLimiter(),
  );

  await connectDB();
  await redisConnection();

  app.get("/", (req, res) => {
    successResponse({ res, statusCode: 201, message: "Hello " });
  });
  /*await sendEmail({
        to:"aya.kahder10@gmail.com",
        text:"cfcfdcf",
        subject:"csvrsvv"
  })*/

  modules.forEach((module) => attachRouterWithLogger(app, module));

  app.use("/uploads", express.static(path.resolve("./src/uploads ")));

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/message", messageRouter);
  app.use("/api/v1/user", userRouter);

  app.all("/*dummy", (req, res) => {
    NotFoundException("Not Found Handler");
  });

  app.use(globalErrorHandler);
};

export default bootstrap;
