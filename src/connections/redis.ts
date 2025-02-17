import { createClient, RedisClientType } from "redis";
import Config from "../config/config";
import logger from "../services/logger.service";

/**
 * Class representing a connection to Redis.
 */
class RedisConnection {
  private redisClients!: RedisClientType;
  private redisPubClients!: RedisClientType;
  private redisSubClients!: RedisClientType;

  /**
   * Connects to Redis and returns a Promise that resolves when the connection is established.
   * @returns {Promise<string>} A Promise that resolves with an empty string upon successful connection.
   */
  redisConnect(): Promise<string> {
    return new Promise((resolve, reject) => {
      const { REDIS_DB, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = Config;

      // Redis configuration object
      const redisConfig: {
        socket: {
          host: string;
          port: number;
        };
        database: number;
        password?: string;
      } = {
        socket: {
          host: REDIS_HOST,
          port: REDIS_PORT,
        },
        database: REDIS_DB,
      };

      // Include password in configuration if provided
      if (REDIS_PASSWORD !== "") {
        redisConfig.password = REDIS_PASSWORD;
      }

      // Create Redis clients for general operations and publishing
      this.redisClients = createClient(redisConfig);
      this.redisPubClients = createClient(redisConfig);

      // Create a separate Redis client for subscribing
      this.redisSubClients = this.redisPubClients.duplicate();

      // Event listener for Redis client's 'error' event
      this.redisClients.on("error", (error: Error) => {
        logger.error("CATCH_ERROR : Redis Client error:", error);
        reject(error); // Reject the promise if there's an error
      });

      // Event listener for Redis publishing client's 'error' event
      this.redisPubClients.on("error", (error: Error) => {
        logger.error("CATCH_ERROR : Redis Pub Client error:", error);
        reject(error); // Reject the promise if there's an error
      });

      (async (): Promise<void> => {
        // Connect all Redis clients
        await this.redisClients.connect();
        await this.redisPubClients.connect();
        await this.redisSubClients.connect();
        logger.info("Redis connected successfully.");
        resolve("");
      })();
    });
  }

  /**
   * Gets the Redis client.
   * @returns {any} The Redis client.
   */
  get redisClient(): any {
    return this.redisClients;
  }

  /**
   * Gets the Redis subscription client.
   * @returns {any} The Redis subscription client.
   */
  get redisSubClient(): any {
    return this.redisSubClients;
  }

  /**
   * Gets the Redis publisher client.
   * @returns {any} The Redis publisher client.
   */
  get redisPubClient(): any {
    return this.redisPubClients;
  }
}

export const redisConnection = new RedisConnection();
