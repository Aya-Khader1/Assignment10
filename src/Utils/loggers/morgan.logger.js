import nodePath from "node:path";
import morgan from "morgan";
import fs from "node:fs";

const _dirname = nodePath.resolve();

export function attachRouterWithLogger(app, { path, router, logFile }) {
  const logStream = fs.createWriteStream(
    nodePath.resolve(_dirname, "./src/loggers", logFile),
    { flags: "a" },
  );

  app.use(path, morgan("combined", { stream: logStream }));
  app.use(path, morgan("dev"));
  app.use(path, router);
}
