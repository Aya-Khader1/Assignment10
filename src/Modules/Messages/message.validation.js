import joi from "joi";

export const sendMessge = {
  body: joi.object({
    content: joi.string().min(1).max(500).required(),
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
