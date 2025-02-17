import { Request, Response } from "express";
import { ActivityLogModel } from "../models/activityLogs.model";

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
