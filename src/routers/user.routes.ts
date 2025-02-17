import express from "express";
import { login, signup, userDetails } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const User = express.Router();

User.post("/signup", signup);
User.post("/login", login);
User.get("/user", authMiddleware, userDetails);

export default User;
