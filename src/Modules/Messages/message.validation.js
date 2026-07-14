import joi from "joi";
import { Types } from "mongoose";

export const sendMessgeSchema = {
  body: joi.object({
    content: joi.string().min(1).max(500).required().messages({
      "string.empty": "Message cannot be empty",
      "string.max": "Message cannot be exceed 500 character",
    }),
  }),
  params: joi.object({
    receiverId: joi.string().custom((value, helper) => {
      return (
        Types.ObjectId.isValid(value) ||
        helper.message("Invalid ObjectId Format")
      );
    }),
  }),
};
export const toggleReadSchema = {
  params: joi.object({
    messageId: joi.string().custom((value, helper) => {
      return (
        Types.ObjectId.isValid(value) ||
        helper.message("Invalid ObjectId Format")
      );
    }),
  }),
};

export const toggleFavoritesSchema = {
  params: joi.object({
    messageId: joi.string().custom((value, helper) => {
      return (
        Types.ObjectId.isValid(value) ||
        helper.message("Invalid ObjectId Format")
      );
    }),
  }),
};
