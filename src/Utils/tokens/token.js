import jwt from "jsonwebtoken";
import { RoleEnum, SignatureEnum } from "../enums/user.enum.js";
import {
  ACCESS_TOKEN_ADMIN_EXPIRES_IN,
  ACCESS_TOKEN_ADMIN_SECRET,
  ACCESS_TOKEN_USER_EXPIRES_IN,
  ACCESS_TOKEN_USER_SECRET,
  REFRESH_TOKEN_ADMIN_EXPIRES_IN,
  REFRESH_TOKEN_USER_EXPIRES_IN,
  REFRESH_TOKEN_ADMIN_SECRET,
  REFRESH_TOKEN_USER_SECRET,
} from "../../../config/config.service.js";
import { v4 as uuid } from "uuid";

export const generateToken = ({ payload, secretKey, options }) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = ({ token, secretKey }) => {
  return jwt.verify(token, secretKey);
};

export const getSignature = ({ signatureLevel = SignatureEnum.User }) => {
  let signature = { accessSignature: undefined, refreshSignature: undefined };
  switch (signatureLevel) {
    case SignatureEnum.Admin:
      signature.accessSignature = ACCESS_TOKEN_ADMIN_SECRET;
      signature.refreshSignature = REFRESH_TOKEN_ADMIN_SECRET;
      break;
    case SignatureEnum.User:
      signature.accessSignature = ACCESS_TOKEN_USER_SECRET;
      signature.refreshSignature = REFRESH_TOKEN_USER_SECRET;
      break;
    default:
      signature.accessSignature = ACCESS_TOKEN_USER_SECRET;
      signature.refreshSignature = REFRESH_TOKEN_USER_SECRET;
      break;
  }
  return signature;
};

export const getNewLoginCredentials = async (
  user,
  { rememberMe = false } = {},
  type = "LOGIN",
) => {
  const signature = await getSignature({
    signatureLevel:
      user.role != RoleEnum.ADMIN ? SignatureEnum.User : SignatureEnum.Admin,
  });
  const jwtid = uuid();
  const accessToken = generateToken({
    payload: { id: user._id },
    secretKey: signature.accessSignature,
    options: {
      expiresIn:
        user.role != RoleEnum.ADMIN
          ? Number(ACCESS_TOKEN_USER_EXPIRES_IN)
          : Number(ACCESS_TOKEN_ADMIN_EXPIRES_IN),
      jwtid,
    },
  });
  if (type === "REFRESH") {
    return { accessToken };
  }
  const refreshToken = generateToken({
    payload: { id: user._id },
    secretKey: signature.refreshSignature,
    options: {
      expiresIn: rememberMe
        ? "30d"
        : user.role != RoleEnum.ADMIN
          ? Number(REFRESH_TOKEN_USER_EXPIRES_IN)
          : Number(REFRESH_TOKEN_ADMIN_EXPIRES_IN),
      jwtid,
    },
  });

  return { accessToken, refreshToken };
};
