import { body } from "express-validator";
import validate from "../middlewares/validator.middleware";

export const signupValidation = () =>
  validate([
    body("name").notEmpty().withMessage("name is required."),
    body("email").notEmpty().withMessage("email is required."),
    body("password").notEmpty().withMessage("password is required."),
  ]);

export const loginValidation = () =>
  validate([
    body("email").notEmpty().withMessage("email is required."),
    body("password").notEmpty().withMessage("password is required."),
  ]);

export const inviteUserValidation = () =>
  validate([body("email").notEmpty().withMessage("email is required.")]);

export const acceptInviteValidation = () =>
  validate([body("token").notEmpty().withMessage("token is required.")]);
