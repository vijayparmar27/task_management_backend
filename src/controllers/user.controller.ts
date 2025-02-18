import { Request, Response } from "express";
import User from "../models/user.model";

import bcrypt from "bcryptjs";
import jwt, { verify } from "jsonwebtoken";
import Config from "../config/config";
import { decryptToken, encryptToken } from "../utils/common.utils";
import { nodemailerEmailService } from "../services/nodemailer.service";
import { Types } from "mongoose";
import { Roles } from "../@types/globle.interface";

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

    const user = await User.findById(id).populate("members.id");

    console.log(`----- user : `, JSON.stringify(user, null, 4));

    const userInfo = await User.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(String(id)),
        },
      },
      {
        $lookup: {
          from: "users",
          // Name of the collection where member details are stored
          localField: "members.id",
          foreignField: "_id",
          as: "membersDetails",
        },
      },
      {
        $addFields: {
          members: {
            $map: {
              input: "$members",
              as: "member",
              in: {
                _id: "$$member.id",
                name: {
                  $arrayElemAt: [
                    {
                      $map: {
                        input: {
                          $filter: {
                            input: "$membersDetails",
                            as: "detail",
                            cond: {
                              $eq: ["$$detail._id", "$$member.id"],
                            },
                          },
                        },
                        as: "user",
                        in: "$$user.name",
                      },
                    },
                    0,
                  ],
                },
                email: {
                  $arrayElemAt: [
                    {
                      $map: {
                        input: {
                          $filter: {
                            input: "$membersDetails",
                            as: "detail",
                            cond: {
                              $eq: ["$$detail._id", "$$member.id"],
                            },
                          },
                        },
                        as: "user",
                        in: "$$user.email",
                      },
                    },
                    0,
                  ],
                },
                role: "$$member.role",
              },
            },
          },
        },
      },
      {
        $project: {
          membersDetails: 0,
          "members.password": 0,
        },
      },
    ]);

    if (userInfo.length === 0) {
      return res.status(400).json({ message: "User data not exists" });
    }

    return res.json({
      data: {
        user: userInfo[0],
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const inviteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { JWT_SECRET, FONTEND_URL } = Config;

    const { email } = req.body;

    const { id } = req.headers;
    const token = jwt.sign({ id: id }, JWT_SECRET, { expiresIn: "1Y" });

    const encrypt = encryptToken(token, JWT_SECRET);

    nodemailerEmailService.sendEmail(
      {
        recipient: email,
        subject: "Task Manage invitation",
        body: `
       <h2>You have invitation : <strong>Task Manage invitation</strong></p>
       <p>Click <a href="${FONTEND_URL}/invitation?auth=${encrypt}">here</a> to view the task.</p>
      `,
      },
      true
    );

    return res.json({ message: "invite User successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const acceptInvite = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { JWT_SECRET } = Config;
    const { token } = req.body;
    const { id } = req.headers;

    const decryptedToken = decryptToken(
      (<string>token).split(" ").join("+"),
      JWT_SECRET
    );

    const decoded: any = await verify(decryptedToken, JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }

    await User.updateOne(
      {
        _id: new Types.ObjectId(String(decoded.id)),
      },
      {
        $push: {
          members: {
            id: new Types.ObjectId(String(id)),
            role: Roles.Member,
          },
        },
      }
    );

    return res.json({ message: "invitation accept" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
