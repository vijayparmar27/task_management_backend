import mongoose, { Schema } from "mongoose";
import { ProjectStatus, Roles } from "../@types/globle.interface";
import { IProjectModel } from "../@types/models.interface";

const projectSchema = new Schema<IProjectModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      required: true,
    },
    members: [
      {
        id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: Object.values(Roles), required: true },
      },
    ],
    dueDate: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model<IProjectModel>("Project", projectSchema);
