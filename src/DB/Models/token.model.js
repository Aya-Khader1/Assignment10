import mongoose, { Schema } from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "../../Utils/enums/user.enum.js";

const tokenSchema = new mongoose.Schema(
  {
    jti: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresIn: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

tokenSchema.index("expiresIn", { expireAfterSeconds: 0 }); //delay
const TokenModel = mongoose.model("Token", tokenSchema);

export default TokenModel;
