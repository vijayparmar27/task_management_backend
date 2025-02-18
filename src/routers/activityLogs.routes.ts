import express from "express";
import { listOfLogs, taskLogs } from "../controllers/activityLogs.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const ActivityLogs = express.Router();

ActivityLogs.get("/", authMiddleware, listOfLogs);
ActivityLogs.get(
  "/:taskId",
  //  authMiddleware,
  taskLogs
);

export default ActivityLogs;
