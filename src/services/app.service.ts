import { config } from "../config";
import express from "express";
import packageJson from '../../package.json';
import { setUserRoutes } from "../routes/user.routes";
import bodyParser from "body-parser";
import cors from "cors";
import { logger } from "../middlewares/logger.middleware";
import cookies from "cookie-parser";
import { setRecordRoutes } from "../routes/record.routes";
import { setVehicleRoutes } from "../routes/vehicle.routes";
import { validateToken } from "../middlewares/token.middleware";
import { setMetaRoutes } from "../routes/meta.routes";

const app = express();
console.log(config.isDev? 'Development setup' : 'Production Setup');
// app.use(cors());
app.use(
  cors({
   credentials: true,
    origin: config.isDev ? config.localFEUrl : config.prodFEUrl,
  })
);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cookies());
app.use(logger);
app.use(validateToken);

setUserRoutes(app);
setRecordRoutes(app);
setVehicleRoutes(app);
setMetaRoutes(app);

app.get("/", (req, res) => {
  res.status(200).send(`<h3>App is working: ${packageJson.version} on ${new Date().toString()}</h3>`);
});

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
//   res.header('Access-Control-Expose-Headers', 'Content-Length');
//   res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
//   if (req.method === 'OPTIONS') {
//       return res.sendStatus(200);
//   } else {
//       return next();
//   }
// });

export const startApplication = () => {
  app.listen(config.httpPort, () => {
    console.log(
      `------------- Server started -----v: ${packageJson.version}--------`,
      config.httpPort
    );
  });
};
