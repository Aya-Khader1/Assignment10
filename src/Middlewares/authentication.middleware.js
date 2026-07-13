import { findById, findOne } from "../DB/database.repository.js";
import TokenModel from "../DB/Models/token.model.js";
import UserModel from "../DB/Models/user.model.js";
import { get } from "../DB/redis.service.js";
import { SignatureEnum, TokenTypeEnum } from "../Utils/enums/user.enum.js";
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "../Utils/response/error.response.js";
import { getSignature, verifyToken } from "../Utils/tokens/token.js";
import { revokeTokenKey } from "./../DB/redis.service.js";
export const decodedToken = async ({
  authorization,
  tokenType = TokenTypeEnum.Access,
}) => {
  const [Bearer, token] = authorization.split(" ") || [];
  let signature = await getSignature({
    signatureLevel:
      Bearer === "ADMIN"
        ? SignatureEnum.Admin
        : Bearer === "USER"
          ? SignatureEnum.User
          : new Error("Invalid Signature"),
  });
  const decoded = verifyToken({
    token,
    secretKey:
      tokenType === TokenTypeEnum.Access
        ? signature.accessSignature
        : signature.refreshSignature,
  });

  //check if token is revoked
  const isRevoked = await get({
    key: revokeTokenKey({ userId: decoded.id, jti: decoded.jti }),
  });
  if (isRevoked) throw UnauthorizedException({ message: "Token is Revoked" });

  const user = await findById({ model: UserModel, id: decoded.id });
  if (!user) throw NotFoundException("User Not Found");

  return { user, decoded };
};

export const authentication = ({ tokenType = TokenTypeEnum.Access }) => {
  return async (req, res, next) => {
    const { user, decoded } = await decodedToken({
      authorization: req.headers.authorization,
      tokenType,
    });
    req.user = user;
    req.decoded = decoded;
    return next();
  };
};

export const authorization = ({ accessRoles = [] }) => {
  return async (req, res, next) => {
    if (!accessRoles.includes(req.user.role))
      throw ForbiddenException("Unauthorized Access");
    return next();
  };
};
