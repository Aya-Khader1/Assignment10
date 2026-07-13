import {
  ACCESS_TOKEN_ADMIN_EXPIRES_IN,
  CLIENT_ID,
  SALT_ROUND,
} from "../../../config/config.service.js";
import { HashEnum } from "../../Utils/enums/security.enum.js";
import { decrypt, encrypt } from "../../Utils/security/encryption.security.js";
import {
  compareHash,
  generateHash,
} from "../../Utils/security/hash.security.js";
import {
  generateToken,
  getNewLoginCredentials,
} from "../../Utils/tokens/token.js";
import {
  create,
  findOne,
  findOneAndDelete,
  findOneAndUpdate,
  updateOne,
} from "./../../DB/database.repository.js";
import UserModel from "./../../DB/Models/user.model.js";
import {
  BadRequestException,
  ConfelictException,
  NotFoundException,
} from "./../../Utils/response/error.response.js";
import { successResponse } from "./../../Utils/response/success.response.js";
import { OAuth2Client } from "google-auth-library";
import { LogoutTypeEnum, ProviderEnum } from "./../../Utils/enums/user.enum.js";
import TokenModel from "../../DB/Models/token.model.js";
import { emailSubject, sendEmail } from "../../Utils/email/email.utils.js";
import { generateOTP } from "../../Utils/generateOTP.js";
import { emailEvents } from "../../Utils/events/email.events.js";
import { confirmEmailSchema } from "./auth.validation.js";
import { keys, revokeTokenKey, set } from "../../DB/redis.service.js";

export const signup = async (req, res) => {
  const { username, email, password, phone } = req.body;

  if (await findOne({ model: UserModel, filter: { email } }))
    throw ConfelictException("User already exists");

  const otp = await generateOTP();

  const otphash = await generateHash({
    plaintext: otp,
    algorithm: HashEnum.Argon2,
  });

  const hashPassword = await generateHash({
    plaintext: password,
    saltRounds: Number(SALT_ROUND),
    algorithm: HashEnum.Argon2,
  });
  const encryptedPhone = encrypt(phone);

  const user = await create({
    model: UserModel,
    data: [
      {
        username,
        email,
        password: hashPassword,
        phone: encryptedPhone,
        confirmEmailOTP: otphash,
        confirmEmailOTPExpires: Date.now() + 5 * 60 * 1000,
      },
    ],
  });

  emailEvents.emit("confirmEmail", { to: email, otp, username });

  successResponse({
    res,
    statusCode: 201,
    data: { user },
    message: "User created ",
  });
};

export const confirmEmail = async (req, res) => {
  const { email, otp } = req.body;
  const user = await findOne({
    model: UserModel,
    filter: {
      email,
      confirmEmailOTP: { $exists: true },
      confirmEmail: { $exists: false },
    },
  });

  if (!user) throw NotFoundException("User not found");
  const isMatched = await compareHash({
    plaintext: otp,
    ciphertext: user.confirmEmailOTP,
    algorithm: HashEnum.Argon2,
  });
  if (!isMatched) throw BadRequestException("Invalid OTP");
  if (user.confirmEmailOTPExpires < Date.now())
    throw BadRequestException("OTP Expired");

  await updateOne({
    model: UserModel,
    filter: { email },
    update: {
      confirmEmail: Date.now(),
      $unset: { confirmEmailOTP: true, confirmEmailOTPExpires: true },
    },
  });

  successResponse({
    res,
    statusCode: 200,
    message: "User Confirmed successfully",
  });
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await findOne({
    model: UserModel,
    filter: { email },
  });
  if (!user) return NotFoundException("User Not Found ");
  if (user.confirmEmail) return BadRequestException("User Confirmed");

  const otp = generateOTP();
  const otphash = await generateHash({
    plaintext: otp,
    algorithm: HashEnum.Argon2,
  });

  await updateOne({
    model: UserModel,
    filter: { email },
    update: {
      confirmEmailOTP: otphash,
      confirmEmailOTPExpires: Date.now() + 5 * 60 * 1000,
    },
  });
  emailEvents.emit("Resend Verification Code", { to: email, otp });

  successResponse({ res, statusCode: 200, message: "Check Your Email" });
};

export const login = async (req, res) => {
  const { email, password, rememberMe = false } = req.body;
  const user = await findOne({
    model: UserModel,
    filter: { email, confirmEmail: { $exists: true } },
  });

  if (!user) throw NotFoundException("User not found");
  const isMatched = await compareHash({
    plaintext: password,
    ciphertext: user.password,
    algorithm: HashEnum.Argon2,
  });
  if (!isMatched) throw BadRequestException("Invalid credentials");
  if (user.phone) user.phone = decrypt(user.phone);

  const tokens = await getNewLoginCredentials(user, { rememberMe });

  successResponse({
    res,
    statusCode: 200,
    data: { tokens },
    message: "User logged",
  });
};

export const refreshToken = async (req, res) => {
  const tokens = await getNewLoginCredentials(req.user, {}, "REFRESH");

  successResponse({ res, statusCode: 200, data: { tokens }, message: "Done" });
};

async function verifyGoogleAccount({ idToken }) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

export const loginWithGoogle = async (req, res) => {
  const { idToken } = req.body;
  const { email, email_verified, given_name, family_name, picture } =
    await verifyGoogleAccount({ idToken });
  if (!email_verified) throw BadRequestException("Email Not Verified");

  const user = await findOne({
    model: UserModel,
    filter: { email },
  });

  if (user) {
    if (user.provider === ProviderEnum.GOOGLE) {
      const credentials = await getNewLoginCredentials(user);
      return successResponse({
        res,
        message: "Login Successfully",
        data: { credentials },
        statusCode: 200,
      });
    }
  }
  const newUser = await create({
    model: UserModel,
    data: [
      {
        firstName: given_name,
        lastName: family_name,
        email,
        profilePic: picture,
        provider: ProviderEnum.GOOGLE,
      },
    ],
  });
  const credentials = await getNewLoginCredentials(newUser);
  return successResponse({
    res,
    message: "Login Successfully",
    data: { credentials },
    statusCode: 201,
  });
};

export const logout = async (req, res) => {
  const { flag } = req.body;

  let status = 200;

  switch (flag) {
    case LogoutTypeEnum.logout:
      await create({
        model: TokenModel,
        data: [
          {
            jti: req.decoded.jti,
            userId: req.user._id,
            expiresIn: Date.now() - req.decoded.exp,
          },
        ],
      });

      status = 201;
      break;
    case LogoutTypeEnum.logoutFromAll:
      await updateOne({
        model: UserModel,
        filter: { _id: req.user._id },
        update: {
          changeCredentialsTime: Date.now(),
        },
      });
      status = 200;
      break;
  }

  successResponse({
    res,
    message: "Logout",
    statusCode: status,
  });
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const hashOtp = await generateHash({
    plaintext: otp,
    algorithm: HashEnum.Argon2,
  });
  const user = await findOneAndUpdate({
    model: UserModel,
    filter: {
      email,
      confirmEmail: { $exists: true },
      provider: ProviderEnum.SYSTEM,
    },
    update: {
      forgetPasswordOTP: hashOtp,
    },
  });
  if (!user) throw NotFoundException("User Not Found");

  emailEvents.emit("forgetPassword", {
    to: email,
    username: user.firstName,
    otp,
  });

  return successResponse({
    res,
    message: "Check Your Inbox",
  });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
      forgetPasswordOTP: { $exists: true },
    },
  });

  if (!user) throw NotFoundException("User Not Found");

  const isValidOtp = await compareHash({
    plaintext: otp,
    ciphertext: user.forgetPasswordOTP,
    algorithm: HashEnum.Argon2,
  });

  if (!isValidOtp) throw BadRequestException("Invalid OTP");

  const hashedNewPassword = await generateHash({
    plaintext: newPassword,
    algorithm: HashEnum.Argon2,
  });
  await updateOne({
    model: UserModel,
    filter: { email },
    update: {
      password: hashedNewPassword,
      $unset: { forgetPasswordOTP: true },
    },
  });

  emailEvents.emit("forgetPassword", {
    to: email,
    username: user.firstName,
    otp,
  });

  return successResponse({
    res,
    message: "Password Reset Successfully",
  });
};
export const logoutWithRedis = async (req, res) => {
  await set({
    key: revokeTokenKey({ userId: req.user._id, jti: req.decoded.jti }),
    value: req.decoded.jti,
    ttl: req.decoded.iat + ACCESS_TOKEN_ADMIN_EXPIRES_IN,
  });
  return successResponse({
    res,
    message: "Logout Successfully",
  });
};
