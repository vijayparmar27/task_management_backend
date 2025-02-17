import express from "express";
import { listOfLogs } from "../controllers/activityLogs.controller";

const ActivityLogs = express.Router();

ActivityLogs.get("/", listOfLogs);

export default ActivityLogs;
