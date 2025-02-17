import mongoose, { Schema } from "mongoose";
import { Priority, Status } from "../@types/globle.interface";
import { ITaskModel } from "../@types/models.interface";

const TaskSchema = new Schema<ITaskModel>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  projectId: { type: Schema.Types.ObjectId },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  status: { type: String, enum: Object.values(Status), required: true },
  assignee: { type: Schema.Types.ObjectId, ref: "User" },
  priority: { type: String, enum: Object.values(Priority), required: true },
  dueDate: { type: Number, required: true },
});

export const Task = mongoose.model<ITaskModel>("tasks", TaskSchema);
