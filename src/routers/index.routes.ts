import express from "express";
import User from "./user.routes";
import Projects from "./projects.routes";
import Tasks from "./tasks.routes";
import ActivityLogs from "./activityLogs.routes";

const Index = express.Router();

Index.use("/auth", User);
Index.use("/projects", Projects);
Index.use("/tasks", Tasks);
Index.use("/activityLogs", ActivityLogs);

export default Index;
