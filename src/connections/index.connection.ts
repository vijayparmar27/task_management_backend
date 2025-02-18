import logger from "../services/logger.service";
import { serverConnection } from "./httpServer";
import { mongoConnection } from "./mongoConnection";
import { redisConnection } from "./redis";
import { socketConnection } from "./socket";

export const initializeConnections = async () => {
  try {
    await serverConnection.listenServer();
    await redisConnection.redisConnect();
    await mongoConnection.init();
    // await socketConnection.socketConnect();
  } catch (error) {
    logger.error("CAUGHT ERROR : initializeConnections : ", error);
    throw error;
  }
};
