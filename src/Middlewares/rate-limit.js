import {
  BadRequestException,
  TooManyRequestsException,
} from "../Utils/response/error.response.js";

const ipReq = {};

const blockedIps = new Set();

const unBlockersTimers = new Map();

const RATE_LIMIT = 3;
const WINDOWS_MS = 15 * 60 * 1000;

export const customRateLimiter = () => {
  return (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();
    if (blockedIps.has(ip))
      throw TooManyRequestsException(
        "Too Many Requests,please try again later",
      );
    if (!ipReq[ip]) {
      ipReq[ip] = {
        count: 1,
        startTime: currentTime,
      };
      return next();
    }

    const diff = currentTime - ipReq[ip].startTime;

    if (diff < WINDOWS_MS) {
      ipReq[ip].count++;
      if (ipReq[ip].count > RATE_LIMIT) {
        blockedIps.add(ip);
        if (!unBlockersTimers.has(ip)) {
          const timer = setTimeout(() => {
            blockedIps.delete(ip);
            unBlockersTimers.delete(ip);
          }, WINDOWS_MS);
          unBlockersTimers.set(ip, timer);
        }
        throw TooManyRequestsException(
          "Too Many Requests,please try again later",
        );
      }
    } else {
      ipReq[ip] = {
        count: 1,
        startTime: currentTime,
      };
    }

    return next();
  };
};
