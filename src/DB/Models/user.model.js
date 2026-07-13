import mongoose from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "../../Utils/enums/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "FirstName is Mandatry"],
      minLength: 2,
      maxLength: 25,
    },
    lastName: {
      type: String,
      required: [true, "lastName is Mandatry"],
      minLength: 2,
      maxLength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == ProviderEnum.SYSTEM;
      },
    },
    DOB: Date,
    phone: String,
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.MALE,
    },
    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER,
    },
    provider: {
      type: Number,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.SYSTEM,
    },
    confirmEmail: Date,
    confirmEmailOTP: String,
    confirmEmailOTPExpires: Date,
    forgetPasswordOTP: String,
    profilePic: String,
    converPictures: [String],
    changeCredentialsTime: Date,
    freezedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    freezedAt: Date,
    freezedByRole: {
      type: Number,
      enum: Object.values(RoleEnum),
    },
    restoredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    restoredAt: Date,
    restoreByRole: {
      type: Number,
      enum: Object.values(RoleEnum),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema
  .virtual("username")
  .set(function (value) {
    const [firstName, lastName] = value?.split(" ") || {};
    this.set({ firstName, lastName });
  })
  .get(function () {
    return this.firstName + " " + this.lastName;
  });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
