import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  listOfTasks,
  reassignTask,
  updateTask,
  updateTaskStatus,
} from "../controllers/tasks.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const Tasks = express.Router();

Tasks.post("/", authMiddleware, createTask);

Tasks.get("/project/:projectId", authMiddleware, listOfTasks);

Tasks.get("/:id", getTask);

Tasks.put("/:id", updateTask);

Tasks.patch("/status/:id", updateTaskStatus);

Tasks.patch("/assign/:id", reassignTask);

Tasks.delete("/:id", deleteTask);

export default Tasks;
