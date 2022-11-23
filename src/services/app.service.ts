import { config } from "config";
import express from "express";
import https from 'https';
import { setUserRoutes } from "../routes/user.routes";
import bodyParser from "body-parser";
import cors from "cors";
import { logger } from "middlewares/logger.middleware";
import { validateToken } from "middlewares/token.middleware";
import cookies from "cookie-parser";
import { setRecordRoutes } from "routes/record.routes";
import { setVehicleRoutes } from "routes/vehicle.routes";
import fs from 'fs';


const app = express();

const credentials = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
};





app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
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

app.get("/sttus", (req, res) => {
  res.status(200).send("<h3>App is working</h3>");
});

app.use('/', express.static('build'))
// app.use('/static/js/', express.static('build/static/js'))

// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, '../build/index.html'));
// });

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

const httpsServer = https.createServer(credentials, app);

export const startApplication = () => {
  app.listen(config.port, () => {
    console.log("------------- Server Started -------------", config.port);
  });
  // httpsServer.listen(config.port, () => {
  //   console.log("------------- Server Started -------------", config.port);
  // });
};
