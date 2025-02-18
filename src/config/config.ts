import { IConfig } from "../@types/config.interface";
import dotenv from "dotenv";
import { CONFIG } from "../constants";

const {
  PORT,
  ENVIROMENT,
  SSL_CRT_FILE,
  SSL_KEY_FILE,
  REDIS_DB,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  MONGO_SRV,
  JWT_SECRET,
  NODEMAILER_EMAIL,
  NODEMAILER_PASSWORD,
  FONTEND_URL,
} = CONFIG;

dotenv.config();
const processEnv = process.env;

const Config: IConfig = {
  PORT: Number(processEnv[PORT] ?? 8000),
  ENVIROMENT: processEnv[ENVIROMENT] ?? "local",
  SSL_CRT_FILE: processEnv[SSL_CRT_FILE] ?? "../../certificate/file.crt",
  SSL_KEY_FILE: processEnv[SSL_KEY_FILE] ?? "../../certificate/file.key",

  // REDIS CONFIGURATIONS
  REDIS_DB: Number(processEnv[REDIS_DB] ?? 0),
  REDIS_PASSWORD: processEnv[REDIS_PASSWORD] ?? "",
  REDIS_HOST: processEnv[REDIS_HOST] ?? "127.0.0.1",
  REDIS_PORT: Number(processEnv[REDIS_PORT] ?? 6379),

  // MONGO CONNECTION
  MONGO_SRV:
    processEnv[MONGO_SRV] ?? "mongodb://127.0.0.1:27017/task_management",

  JWT_SECRET: processEnv[JWT_SECRET] ?? "JWT_SECRET",

  NODEMAILER_EMAIL: processEnv[NODEMAILER_EMAIL] ?? "",
  NODEMAILER_PASSWORD: processEnv[NODEMAILER_PASSWORD] ?? "",

  FONTEND_URL: processEnv[FONTEND_URL] ?? "http://localhost:3000",
};

export default Config;
