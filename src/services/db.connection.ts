import { config } from "../config";
import { Sequelize } from "sequelize";

export class DB {
  private static sequelize: Sequelize;

  public static getInstance = () => {
    if (config.isDev) {
      return this.getLocalInstance();
    } else {
      return this.getProdInstance();
    }
  };

  private static getLocalInstance = () => {
    console.log("local DB");
    if (!this.sequelize) {
      this.sequelize = new Sequelize(
        "postgres",
        "postgres",
        config.dbPassword,
        {
          logging: config.dbLogger,
          host: "localhost",
          dialect:
            "postgres" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
        }
      );
    }
    return this.sequelize;
  };

  private static getProdInstance = () => {
    console.log("remote DB");
    if (!this.sequelize) {
      this.sequelize = new Sequelize({
        database: "postgres",
        username: "vbookadmin",
        password: "abcd1234@",
        logging: config.dbLogger,
        host: "vbookserver.postgres.database.azure.com",
        port: 5432,
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true, // This will help you. But you will see nwe error
            rejectUnauthorized: false, // This line will fix new error
          },
        },
      });
    }
    return this.sequelize;
  };
}
