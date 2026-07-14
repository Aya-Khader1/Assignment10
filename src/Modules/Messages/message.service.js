import { create, findById, findOne } from "../../DB/database.repository.js";
import MessageModel from "../../DB/Models/message.model.js";
import UserModel from "../../DB/Models/user.model.js";
import { NotFoundException } from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/success.response.js";

export const sendMessage = async (req, res) => {
  const { receiverId } = req.params;
  const { content } = req.body;

  const receiver = await findOne({
    model: UserModel,
    filter: {
      _id: receiverId,
      freezedAt: { $exists: false },
    },
  });
  if (!receiver)
    throw NotFoundException("Receiver not found or account is freezed");

  const message = await create({
    model: MessageModel,
    data: [
      {
        content,
        receiverId,
      },
    ],
  });
  return successResponse({
    res,
    statusCode: 201,
    message: "Message Sent Successfully",
    data: { message },
  });
};
export const getMessage = async (req, res) => {
  const { page = 1, limit = 10 } = req.params;
  const receiverId = req.user._id;
  const skip = (page - 1) * limit;

  const [messages, totalMessages] = await Promise.all([
    MessageModel.find({ receiverId })
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit)),
    MessageModel.countDocuments({ receiverId }),
  ]);

  return successResponse({
    res,
    statusCode: 201,
    message: "Messages Fetched",
    data: {
      messages,
      pagenation: {
        currentPage: Number(page),
        totalPage: Math.ceil(totalMessages / limit),
        totalMessages,
      },
    },
  });
};

export const toggleRead = async (req, res) => {
  const { messageId } = req.params;
  const receiverId = req.user._id;

  const message = await findById({
    model: MessageModel,
    id: messageId,
  });

  if (!message || message.receiverId.toString() !== receiverId.toString())
    throw NotFoundException("Message Not Found");

  message.isRead = !message.isRead;
  await message.save();
  return successResponse({
    res,
    statusCode: 201,
    message: `Message Marked as ${message.isRead ? "read" : "unread"}`,
    data: {
      updatedMessage: message,
    },
  });
};

export const toggleFavorites = async (req, res) => {
  const { messageId } = req.params;
  const receiverId = req.user._id;
  const message = await findById({
    model: MessageModel,
    id: messageId,
  });
  if (!message || message.receiverId.toString() !== receiverId.toString())
    throw NotFoundException("Message Not Found");

  message.isFavorite = !message.isFavorite;
  await message.save();
  return successResponse({
    res,
    statusCode: 201,
    message: message.isFavorite
      ? "Added to Favorite "
      : "Removed from Favorite",
    data: {
      updatedMessage: message,
    },
  });
};
