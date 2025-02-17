export interface IConfig {
  PORT: number;
  ENVIROMENT: string;
  SSL_CRT_FILE: string;
  SSL_KEY_FILE: string;
  REDIS_DB: number;
  REDIS_HOST: string;
  REDIS_PASSWORD: string;
  REDIS_PORT: number;
  MONGO_SRV: string;
  JWT_SECRET: string;
}
