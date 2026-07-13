import { createClient } from "redis";
import { REDIS_URI } from "../../config/config.service.js";

export const redisClient = createClient({
  url: REDIS_URI,
  RESP: 2,
});

export const redisConnection = async () => {
  try {
    await redisClient.connect();
    console.log(`Redis connected Successfully`);
  } catch (error) {
    console.error("Redis Connection Error", error);
  }
};
