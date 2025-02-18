import express from "express";
import {
  acceptInvite,
  inviteUser,
  login,
  signup,
  userDetails,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  acceptInviteValidation,
  inviteUserValidation,
  loginValidation,
  signupValidation,
} from "../validations/auth.validation";
const User = express.Router();

User.post("/signup", signupValidation(), signup);
User.post("/login", loginValidation(), login);
User.get("/user", authMiddleware, userDetails);
User.post("/invite", authMiddleware, inviteUserValidation(), inviteUser);
User.post(
  "/accept_invite",
  authMiddleware,
  acceptInviteValidation(),
  acceptInvite
);

export default User;
