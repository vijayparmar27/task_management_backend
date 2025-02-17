import { Schema, model, Document, Types } from "mongoose";
import { IActivityLog } from "../@types/models.interface";
import { Status } from "../@types/globle.interface";

const ActivitySchema = new Schema<IActivityLog>(
  {
    taskId: { type: Schema.Types.ObjectId, required: true, ref: "Task" },
    activity: [
      {
        from: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        to: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        previousStatus: {
          type: String,
          enum: Object.values(Status),
          required: true,
        },
        status: { type: String, enum: Object.values(Status), required: true },
      },
    ],
  },
  { timestamps: true }
);

export const ActivityLogModel = model<IActivityLog>(
  "ActivityLog",
  ActivitySchema
);
