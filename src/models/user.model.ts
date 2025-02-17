import mongoose, { Schema } from "mongoose";
import { IUserModel } from "../@types/models.interface";
import { Roles } from "../@types/globle.interface";

const members: Schema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: Object.values(Roles), required: true },
  },
  {
    _id: false,
  }
);

const userSchema: Schema = new Schema<IUserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    members: [members],
  },
  { timestamps: true }
);

const User = mongoose.model<IUserModel>("User", userSchema);

export default User;
