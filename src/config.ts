import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  adminUserId: 19,
  isDev: process.env.IS_DEV == 'true',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "1111",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "2222",
  userTokenSecret: process.env.USER_TOKEN_SECRET ?? "3333",

  dbPassword: process.env.DB_PASSWORD,
  cacheTimeout: 60 * 60 * 24 * 3,
  accessTokenValidity: 60 * 60 * 24 * 1,
  refreshTokenValidity: 60 * 60 * 24 * 5,
  resetPasswordTimeout: 120 * 1000,

  localFEUrl: "http://localhost:3000",
  prodFEUrl: "https://rimcup-ff66e.firebaseapp.com",

  dbLogger: false,
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
