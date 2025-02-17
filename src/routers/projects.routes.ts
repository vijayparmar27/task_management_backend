import express from "express";
import {
  //   addOrRemoveMemberFromProject,
  changeStatus,
  createProject,
  deleteProject,
  getProjects,
  getSingleProjects,
  updateProject,
} from "../controllers/projects.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const Projects = express.Router();

Projects.post("/", authMiddleware, createProject);

Projects.get("/", authMiddleware, getProjects);

Projects.get("/:id", authMiddleware, getSingleProjects);

Projects.put("/:id", authMiddleware, updateProject);

Projects.patch("/status/:id", authMiddleware, changeStatus);

// Projects.patch("/:id/members", addOrRemoveMemberFromProject);

Projects.delete("/:id", authMiddleware, deleteProject);

export default Projects;
