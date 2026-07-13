import { redisClient } from "./redis-connection.js";

export const revokeTokenKeyPrefix = ({ userId }) => {
  return `user:revokeToken:${userId}`;
};

export const revokeTokenKey = ({ userId, jti }) => {
  return `${revokeTokenKeyPrefix(userId)}:${jti}`;
};

export const set = async ({ key, value, ttl = null }) => {
  try {
    const data = typeof value != "string" ? JSON.stringify(value) : value;
    if (ttl) {
      return await redisClient.set(key, data, {
        expiration: { type: "EX", value: ttl },
      });
    } else {
      return await redisClient.set(key, data);
    }
  } catch (error) {
    console.error("Redis Set Error:", error);
  }
};

export const get = async ({ key }) => {
  try {
    const data = await redisClient.get(key);
    return data;
  } catch (error) {
    console.error("Redis Get Error:", error);
  }
};

export const update = async ({ key, value, ttl = null }) => {
  try {
    const isExists = await redisClient.exists(key);
    if (!isExists) return false;
    const data = typeof value != "string" ? JSON.stringify(value) : value;
    if (ttl) {
      return await redisClient.set(key, data, {
        expiration: { type: "EX", value: ttl },
      });
    } else {
      return await redisClient.set(key, data);
    }
  } catch (error) {
    console.error("Redis Update Error:", error);
  }
};

export const del = async ({ key }) => {
  try {
    const isExists = await redisClient.exists(key);
    if (!isExists) return false;
    return await redisClient.del(key);
  } catch (error) {
    console.error("Redis Del Error:", error);
  }
};

export const expire = async ({ key, ttl }) => {
  try {
    const isExists = await redisClient.exists(key);
    if (!isExists) return false;
    return await redisClient.expire(key, ttl);
  } catch (error) {
    console.error("Redis Expire Error:", error);
  }
};

export const ttl = async ({ key }) => {
  try {
    const isExists = await redisClient.exists(key);
    if (!isExists) return false;
    return await redisClient.ttl(key);
  } catch (error) {
    console.error("Redis TTL Error:", error);
  }
};

export const keys = async ({ patterns }) => {
  try {
    return await redisClient.keys(patterns);
  } catch (error) {
    console.error("Redis Keys Error:", error);
  }
};
