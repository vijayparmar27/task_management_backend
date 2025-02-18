import { Request, Response } from "express";
import { Task } from "../models/tasks.model";
import { ActivityLogModel } from "../models/activityLogs.model";
import { Types } from "mongoose";

export const createTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.headers;
    const {
      status,
      title,
      description,
      assignee,
      priority,
      dueDate,
      projectId,
    } = req.body;

    const task = await new Task({
      userId: new Types.ObjectId(String(id)),
      projectId: new Types.ObjectId(String(projectId)),
      title,
      description,
      status,
      priority,
      dueDate: new Date(dueDate).getTime(),
      assignee: new Types.ObjectId(String(assignee ?? id)),
    }).save();

    await new ActivityLogModel({
      taskId: task._id,
      activity: [
        {
          from: new Types.ObjectId(String(id)),
          to: new Types.ObjectId(String(assignee ?? id)),
          status,
        },
      ],
    }).save();

    res.status(201).json({ message: "Task created", data: task });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

export const listOfTasks = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({
      projectId: new Types.ObjectId(projectId),
    }).select({
      updatedAt: 0,
      __v: 0,
    });

    res.json({ data: { tasks } });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
};

export const getTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ data: { task } });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving task", error });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { status, assignee, priority, dueDate } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Log status change if it occurs
    if (status && task.status !== status) {
      const activityEntry = {
        from: task.assignee, // previous assignee or the user initiating the change
        to: assignee || task.assignee, // new assignee if provided
        previousStatus: task.status,
        status,
      };

      let log = await ActivityLogModel.findOne({ taskId: task._id });
      if (log) {
        log.activity.push(activityEntry);
        await log.save();
      } else {
        log = new ActivityLogModel({
          taskId: task._id,
          activity: [activityEntry],
        });
        await log.save();
      }
    }

    task.status = status || task.status;
    task.assignee = assignee || task.assignee;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    await task.save();
    res.json({ message: "task update Successfully", data: { task } });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (status && task.status !== status) {
      const activityEntry = {
        from: task.assignee,
        to: task.assignee, // or provide a new assignee if your logic requires it
        previousStatus: task.status,
        status,
      };

      let log = await ActivityLogModel.findOne({ taskId: task._id });
      if (log) {
        log.activity.push(activityEntry);
        await log.save();
      } else {
        log = new ActivityLogModel({
          taskId: task._id,
          activity: [activityEntry],
        });
        await log.save();
      }
      task.status = status;
      await task.save();
    }
    res.json({ message: "move successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing task status", error });
  }
};

export const reassignTask = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { assignee } = req.body;
    if (!assignee) {
      return res.status(400).json({ message: "Assignee is required" });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    // Optionally, log the assignment change if needed
    const previousAssignee = task.assignee;
    task.assignee = assignee;
    await task.save();

    // Log the assignment change in the activity log
    const activityEntry = {
      from: previousAssignee,
      to: assignee,
      previousStatus: task.status,
      status: task.status, // same status, only assignment changed
    };

    let log = await ActivityLogModel.findOne({ taskId: task._id });
    if (log) {
      log.activity.push(activityEntry);
      await log.save();
    } else {
      log = new ActivityLogModel({
        taskId: task._id,
        activity: [activityEntry],
      });
      await log.save();
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error reassigning task", error });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
