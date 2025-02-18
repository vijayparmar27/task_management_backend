import Bull, { JobOptions } from "bull";
import Config from "../config/config";

class QueueBaseClass {
  protected queue: Bull.Queue<any>;

  constructor(queueName: string) {
    const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DB } = Config;

    const redisConfig: {
      host: string;
      port: number;
      db: number;
      password?: string;
    } = {
      host: REDIS_HOST,
      port: REDIS_PORT,
      db: REDIS_DB,
    };

    if (REDIS_PASSWORD !== "") {
      redisConfig.password = REDIS_PASSWORD;
    }

    this.queue = new Bull(queueName, { redis: redisConfig });
  }

  addQueue = async (
    data: {
      jobId?: string;
      timezone?: string;
    },
    queueOption: JobOptions
  ): Promise<void> => {
    try {
      await this.queue.add(data, { ...queueOption, jobId: data.jobId });
    } catch (error) {
      console.error("--- cronQueue :: ERROR ::", error);
    }
  };

  removeQueue = async (jobId: string): Promise<void> => {
    try {
      const jobData = await this.queue.getJob(jobId);
      if (jobData) {
        await jobData.remove();
      }
    } catch (error) {
      console.error("--- cronQueue :: ERROR ::", error);
    }
  };

  empty = async (): Promise<void> => {
    await this.queue.empty();
  };
}

export default QueueBaseClass;
