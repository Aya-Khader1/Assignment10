import { WHITE_LIST } from "../../../config/config.service.js";
import { BadRequestException } from "../response/error.response.js";
export function corsOption() {
  const list = WHITE_LIST.split(",");
  const corsOptions = {
    origin: function (origin, callback) {
      if (list.includes(origin)) {
        callback(null, true);
      } else if (!origin) {
        callback(null, true);
      } else {
        callback(BadRequestException("Not Allowed By CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH"],
  };
  return corsOptions;
}
