import mongoose from "mongoose";
import Config from "../config/config";
import logger from "../services/logger.service";

class MongoDB {
  public DB_NAME: any;
  public url: any;
  private dbInstance: any;
  private gameConfig: any;

  constructor() {
    this.DB_NAME = "";
    this.url = null;
    this.dbInstance = null;
  }

  getUrl(
    DB_PROTO: string,
    DB_HOST: string,
    DB_PORT: string,
    DB_NAME: string,
    DB_USERNAME: string,
    DB_PASSWORD: string
  ) {
    const { MONGO_SRV } = Config;
    // return `${DB_PROTO}://${DB_HOST}:${DB_PORT}/${DB_NAME}`
    return MONGO_SRV;
    // return `${DB_PROTO}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`; //?retryWrites=true&w=majority
  }

  async connection(resolve: any, reject: any) {
    try {
      logger.debug(`this.url :: ${this.url}`);

      await mongoose.connect(this.url);
      logger.info("MONGODB Connected successfully!");
      resolve();
    } catch (error) {
      reject(error);
    }
  }

  async init() {
    const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD }: any = Config;

    this.DB_NAME = DB_NAME;
    this.url = this.getUrl(
      "mongodb",
      DB_HOST,
      DB_PORT,
      DB_NAME,
      DB_USERNAME,
      DB_PASSWORD
    );
    logger.debug(this.url);
    return new Promise(this.connection.bind(this));
  }

  get GetConfig() {
    return this.gameConfig;
  }

  get db() {
    return this.dbInstance;
  }

  set UpdateConfig(data: any) {
    this.gameConfig = data;
  }
}

export const mongoConnection = new MongoDB();
