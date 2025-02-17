import { Request, Response } from "express";
import User from "../models/user.model";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Config from "../config/config";
import { encryptToken } from "../utils/common.utils";

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const { JWT_SECRET } = Config;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1Y" });

    const encrypt = encryptToken(token, JWT_SECRET);

    res.set("token", encrypt);

    return res.json({
      message: "Login successfully",
      data: {
        token: encrypt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const userDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.headers;

    const user = await User.findById(id).select({
      name: 1,
      email: 1,
    });

    if (!user) {
      return res.status(400).json({ message: "User data not exists" });
    }

    return res.json({
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
