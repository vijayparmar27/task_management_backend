import { Project } from "../../models/projects.model";
import logger from "../../services/logger.service";
import { nodemailerEmailService } from "../../services/nodemailer.service";
import QueueBaseClass from "../queueBaseClass";
const { DateTime } = require("luxon");

class ProjectCronQueue extends QueueBaseClass {
  /**
   * Creates an instance of DriverAutoOfflineQueue
   * Initializes the queue and sets up the processing function
   */
  constructor() {
    super("ProjectCronQueue");
    this.queue.process(this.processCron);
  }

  async processCron(): Promise<void> {
    try {
      const projects = await Project.aggregate([
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
          $project: {
            title: 1,
            status: 1,
            dueDate: 1,
            email: { $arrayElemAt: ["$userDetails.email", 0] },
          },
        },
      ]);

      projects.forEach((project) => {
        const istDate = DateTime.fromISO(project.dueDate, {
          zone: "utc",
        }).setZone("Asia/Kolkata");
        nodemailerEmailService.sendEmail(
          {
            recipient: project.email,
            subject: "Task Manage",
            body: `
          <h2>Your Project : <strong>${project.title}</strong></p>
          <h4> your project deadline is over : ${istDate.toFormat(
            "yyyy-MM-dd HH:mm:ss ZZZZ"
          )} </h4>
          <h4>Project Status : ${project.status}</h4>
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

export const projectCronQueue = new ProjectCronQueue();
