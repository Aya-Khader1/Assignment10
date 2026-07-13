import mongoose from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "../../Utils/enums/user.enum.js";
import { ref } from "node:process";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "FirstName is Mandatry"],
      minLength: 1,
      maxLength: 500,
      trim: true,
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "FirstName is Mandatry"],
    },
    isRead: {
      type: Boolean,
      default: true,
    },
    isFav: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
messageSchema.index({ receiverId: 1 });
const MessageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default MessageModel;
