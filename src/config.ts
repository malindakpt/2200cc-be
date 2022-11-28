import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  isDev: false,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "",
  userTokenSecret: process.env.USER_TOKEN_SECRET ?? "",

  dbPassword: process.env.DB_PASSWORD,
  accessTokenValidity: 60 * 2,
  refreshTokenValidity: 60 * 60 * 24 * 2,
  resetPasswordTimeout: 120 * 1000,

  localFEUrl: "http//localhost:3000",
  prodFRUrl: "https://wonderful-grass-0bd9e6400.2.azurestaticapps.net",

  dbLogger: true,
  fromEmail: "malindakpt@gmail.com",
  password: "ghkmmuqpneeibyis",
  httpPort: process.env.PORT ?? 3600,
  httpsPort: 3601,
  resetPasswordDigits: 6,
  resetPasswordValidityMinutes: 1,
  stringSplitter: "&&",
  appEndpoint: "http://localhost:3600",
  apiEndpoint: "http://localhost:3600",
  jwt_secret: "myS33!!creeeT",
  jwt_expiration_in_seconds: 36000,
  environment: "dev",
  permissionLevels: {
    NORMAL_USER: 1,
    PAID_USER: 4,
    ADMIN: 2048,
  },
};
