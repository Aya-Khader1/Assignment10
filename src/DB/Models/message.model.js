import mongoose from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "../../Utils/enums/user.enum.js";
import { FAILOVER_MODES } from "redis";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Content is Mandatry"],
      minLength: [1, "Message must be at least 1 character long"],
      maxLength: [500, "Message cannot exceed 500 characters"],
      trim: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
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
