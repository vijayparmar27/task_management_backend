import express from "express";
import {
  acceptInvite,
  inviteUser,
  login,
  signup,
  userDetails,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const User = express.Router();

User.post("/signup", signup);
User.post("/login", login);
User.get("/user", authMiddleware, userDetails);
User.post("/invite", authMiddleware, inviteUser);
User.post("/accept_invite", authMiddleware, acceptInvite);

export default User;
