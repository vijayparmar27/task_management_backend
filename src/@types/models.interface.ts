import { Document, ObjectId } from "mongoose";
import { Priority, ProjectStatus, Roles, Status } from "./globle.interface";

export interface IUserModel extends Document {
  name: string;
  email: string;
  password: string;
  members: {
    id: ObjectId;
    role: Roles;
  }[];
}

export interface IProjectModel extends Document {
  userId: ObjectId;
  status: ProjectStatus;
  title: string;
  description: string;
  // members: {
  //   id: ObjectId;
  //   role: Roles;
  // }[];
  membersIds: ObjectId[];
  dueDate: number;
}

export interface ITaskModel extends Document {
  userId: ObjectId;
  projectId: ObjectId;
  title: string;
  description: string;
  status: Status;
  assignee: ObjectId;
  priority: Priority;
  dueDate: number;
}

export interface IActivityLog extends Document {
  taskId: ObjectId;
  activity: {
    from: ObjectId;
    to: ObjectId;
    previousStatus: Status;
    status: Status;
  }[];
}
