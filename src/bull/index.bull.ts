import { projectCronQueue } from "./queue/projectCron.queue";
import { taskCronQueue } from "./queue/taskCronCron.queue";

export const bullQueue = {
  projectCronQueue,
  taskCronQueue,
};
