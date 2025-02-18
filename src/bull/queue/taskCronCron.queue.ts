import { Types } from "mongoose";
import { Project } from "../../models/projects.model";
import { Task } from "../../models/tasks.model";
import logger from "../../services/logger.service";
import { nodemailerEmailService } from "../../services/nodemailer.service";
import QueueBaseClass from "../queueBaseClass";
const { DateTime } = require("luxon");

class TaskCronQueue extends QueueBaseClass {
  /**
   * Creates an instance of DriverAutoOfflineQueue
   * Initializes the queue and sets up the processing function
   */
  constructor() {
    super("TaskCronQueue");
    this.queue.process(this.processCron);
  }

  async processCron(): Promise<void> {
    try {
      const tasks = await Task.aggregate([
        {
          $match: {
            dueDate: { $gte: Date.now() },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "assignee",
            foreignField: "_id",
            as: "assigneeDetails",
          },
        },
        {
          $project: {
            title: 1,
            status: 1,
            dueDate: 1,
            email: { $arrayElemAt: ["$userDetails.email", 0] },
            assigneremail: { $arrayElemAt: ["$assigneeDetails.email", 0] },
          },
        },
      ]);

      tasks.forEach((task) => {
        const istDate = DateTime.fromISO(task.dueDate, {
          zone: "utc",
        }).setZone("Asia/Kolkata");
        nodemailerEmailService.sendEmail(
          {
            recipient: [...new Set([task.email, task.assigneremail])],
            subject: "Task Manage",
            body: `
          <h2>Your Project Task : <strong>${task.title}</strong></p>
          <h4> your Task deadline is over : ${istDate.toFormat(
            "yyyy-MM-dd HH:mm:ss ZZZZ"
          )} </h4>
          <h4>Task Status : ${task.status}</h4>
          `,
          },
          true
        );
      });
    } catch (error) {
      logger.error(`----- ProjectCronQueue :: Error :`, error);
    }
  }
}

export const taskCronQueue = new TaskCronQueue();

taskCronQueue.processCron();
