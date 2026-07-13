import joi from "joi";
import { generaleFields } from "../../Middlewares/validation.middleware.js";
import { Types } from "mongoose";

export const updatePasswordSchema = {
  body: joi.object({
    oldPassword: generaleFields.oldPassword,
    newPassword: generaleFields.password.required(),
    otp: generaleFields.otp,
    confirmPassword: joi.ref("newPassword"),
    rememberMe: joi.boolean().optional(),
  }),
};

export const freezeSchema = {
  params: joi.object({
    userId: joi.string().custom((value, helper) => {
      return (
        Types.ObjectId.isValid(value) ||
        helper.message("Invalid ObjectId Format")
      );
    }),
  }),
};

export const restoreSchema = {
  params: joi.object({
    userId: joi.string().custom((value, helper) => {
      return (
        Types.ObjectId.isValid(value) ||
        helper.message("Invalid ObjectId Format")
      );
    }),
  }),
};

export const hardDeleteSchema = {
  params: joi.object({
    userId: joi.string().custom((value, helper) => {
      return (
        Types.ObjectId.isValid(value) ||
        helper.message("Invalid ObjectId Format")
      );
    }),
  }),
};
