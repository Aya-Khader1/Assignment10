import jwt from "jsonwebtoken";
import { successResponse } from "../../Utils/response/success.response.js";
import {
  findById,
  findByIdandUpdate,
  findOneAndUpdate,
  updateOne,
  deleteOne,
} from "../../DB/database.repository.js";
import UserModel from "../../DB/Models/user.model.js";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "../../Utils/response/error.response.js";
import { decrypt } from "../../Utils/security/encryption.security.js";
import {
  compareHash,
  generateHash,
} from "../../Utils/security/hash.security.js";
import { HashEnum } from "../../Utils/enums/security.enum.js";
import { RoleEnum } from "../../Utils/enums/user.enum.js";
import { nanoid } from "nanoid";

export const getProfile = async (req, res) => {
  const { user } = req;
  if (user.phone) user.phone = decrypt(user.phone);
  successResponse({ res, statusCode: 200, data: { user } });
};

export const updateProfilePic = async (req, res) => {
  const user = await findByIdandUpdate({
    model: UserModel,
    id: req.user._id,
    update: { profilePic: req.file.finalPath },
    returnDocument: "after",
  });
  successResponse({ res, statusCode: 200, data: user, message: "Done" });
};

export const updateCoverPictures = async (req, res) => {
  const user = await findByIdandUpdate({
    model: UserModel,
    id: req.user._id,
    update: { converPictures: req.files?.map((file) => file.finalPath) },
  });
  successResponse({ res, statusCode: 200, data: user, message: "Done" });
};

export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const isValidOldPassword = await compareHash({
    plaintext: oldPassword,
    ciphertext: req.user.password,
    algorithm: HashEnum.Argon2,
  });
  if (!isValidOldPassword) throw BadRequestException("Invalid Credentials");

  const hashPassword = await generateHash({
    plaintext: newPassword,
    algorithm: HashEnum.Argon2,
  });
  await updateOne({
    model: UserModel,
    filter: { _id: req.user._id },
    update: { password: hashPassword },
  });
  successResponse({
    res,
    message: "Password Updated Successfully",
  });
};

export const freezeAccount = async (req, res) => {
  const { userId } = req.params;
  const targetUserId = userId || req.user._id;
  if (
    targetUserId.toString() !== req.user._id.toString() &&
    req.user.role !== RoleEnum.ADMIN
  )
    throw ForbiddenException("You Are Not Authorized to Freeze this account");

  const updatedUser = await findOneAndUpdate({
    model: UserModel,
    filter: { _id: targetUserId, freezedAt: { $exists: false } },
    update: {
      freezedBy: req.user._id,
      freezedByRole: req.user.role,
      freezedAt: new Date(),
      $unset: { restoredBy: true, restoredByAt: true },
    },
  });
  if (!updatedUser)
    throw NotFoundException("User Not Found or Account Is Already Frozen");
  successResponse({
    res,
    message: "Forzen Successfully",
    statusCode: 200,
    data: { updatedUser },
  });
};

export const restoredAccount = async (req, res) => {
  const { userId } = req.params;
  const targetUserId = userId || req.user._id;
  const user = await findById({
    model: UserModel,
    id: targetUserId,
  });
  console.log(user);
  if (!user || !user.freezedAt)
    throw NotFoundException("User Not Found or Account is not frozen");

  if (user.freezeByRole === RoleEnum.ADMIN) {
    if (req.user.role !== RoleEnum.ADMIN)
      throw ForbiddenException(
        "This account was frozen By an Admin.Only an Admin can restore it",
      );
  } else {
    if (
      targetUserId.toString() !== req.user._id.toString() &&
      req.user.role !== RoleEnum.ADMIN
    )
      throw ForbiddenException("You are not authorized");
  }
  const updatedUser = await findOneAndUpdate({
    model: UserModel,
    filter: {
      _id: targetUserId,
    },
    update: {
      restoredAt: new Date(),
      restoredBy: req.user._id,
      $unset: { freezedAt: true, freezedBy: true, freezedByRole: true },
    },
    options: {
      returnDocument: "after",
    },
  });
  successResponse({
    res,
    message: "Restored Successfully",
    statusCode: 200,
    data: { updatedUser },
  });
};

export const hardDeleteAccount = async (req, res) => {
  const { userId } = req.params;
  const results = await deleteOne({
    model: UserModel,
    filter: { _id: userId },
  });
  if (!results.deletedCount) throw NotFoundException("User Not Found");
  successResponse({
    res,
    message: "User Deleted Successfully",
    statusCode: 200,
  });
};
