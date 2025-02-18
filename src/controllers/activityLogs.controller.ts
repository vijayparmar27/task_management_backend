import { Request, Response } from "express";
import { ActivityLogModel } from "../models/activityLogs.model";
import { Types } from "mongoose";

export const listOfLogs = async (req: Request, res: Response): Promise<any> => {
  try {
    const { taskId } = req.query;
    if (!taskId) {
      return res
        .status(400)
        .json({ message: "taskId query parameter is required" });
    }
    const logs = await ActivityLogModel.find({ taskId })
      .populate("activity.from")
      .populate("activity.to");
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving activity logs", error });
  }
};

export const taskLogs = async (req: Request, res: Response): Promise<any> => {
  try {
    const { taskId } = req.params;

    const taskLogs = await ActivityLogModel.aggregate([
      {
        $match: { taskId: new Types.ObjectId(taskId) },
      },
      {
        $unwind: "$activity",
      },
      {
        $lookup: {
          from: "users",
          let: { fromId: "$activity.from" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$fromId"] },
              },
            },
            {
              $project: {
                name: 1,
                email: 1,
                _id: 0,
              },
            },
          ],
          as: "fromDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { toId: "$activity.to" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$toId"] },
              },
            },
            {
              $project: {
                name: 1,
                email: 1,
                _id: 0,
              },
            },
          ],
          as: "toDetails",
        },
      },
      {
        $addFields: {
          "activity.fromDetails": { $arrayElemAt: ["$fromDetails", 0] },
          "activity.toDetails": { $arrayElemAt: ["$toDetails", 0] },
        },
      },
      {
        $project: {
          fromDetails: 0,
          toDetails: 0,
        },
      },
      {
        $group: {
          _id: "$_id",
          taskId: { $first: "$taskId" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          activity: { $push: "$activity" },
        },
      },
    ]);

    return res.json({ data: { taskLogs: taskLogs[0] } });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving activity logs", error });
  }
};
