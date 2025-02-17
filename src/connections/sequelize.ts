import { Sequelize } from "sequelize";
import logger from "../services/logger.service";
import Config from "../config/config";

class SequelizeConnection {
  private sequelize!: Sequelize;

  async connection() {
    try {
      const { SQL_HOST, SQL_USER_NAME, SQL_PASSWORD, SQL_DATABASE } = Config;

      this.sequelize = new Sequelize(
        SQL_DATABASE,
        SQL_USER_NAME,
        SQL_PASSWORD,
        {
          host: SQL_HOST,
          dialect: "postgres",
        }
      );

      await this.sequelize.authenticate();
      logger.info(
        "SequelizeConnection Connection has been established successfully."
      );
    } catch (error) {
      logger.error("Caught Error : SequelizeConnection :: ", error);
    }
  }
}

export const sequelizeConnection = new SequelizeConnection();
