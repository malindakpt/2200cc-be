import { config } from "../config";
import { Sequelize } from "sequelize";

export class DB {
  private static sequelize: Sequelize;

  public static getInstance = () => {
    if (config.isDev) {
      return this.getLocalInstance();
    } else {
      return this.getProdHerokuInstance();
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

  private static getProdHerokuInstance = () => {
    console.log("remote DB");
    if (!this.sequelize) {
      this.sequelize = new Sequelize({
        database: "dbiv7dpt7ae1d2",
        username: "xndblagfangjqe",
        password: "27bc64364152c5d5814cf40e829b5749a3872fec2e3a64991c31b6571f7f7cfd",
        logging: config.dbLogger,
        host: "ec2-3-225-213-67.compute-1.amazonaws.com",
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

  private static getProdAzureInstance = () => {
    console.log("remote DB");
    if (!this.sequelize) {
      this.sequelize = new Sequelize({
        database: "rimcup",
        username: "rimcupadmin",
        password: "abcd1234@",
        logging: config.dbLogger,
        host: "rimcup.database.windows.net",
        // port: 5432,
        dialect: "mssql",
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

  private static getProdInstancePostgres = () => {
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
