import authRoute from "../routes/authRoute";
import userRoute from "../routes/userRoute";
import { logger } from "../logger/winston";

const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require(`path`);
const app = express();
const server = http.createServer(app);
const privateKey = (path.join(__dirname, "/private.key"));
const certificatePem = path.join(__dirname, "/certificate.pem");

if (fs.existsSync(privateKey) && fs.existsSync(certificatePem)) {
  const SecurServer = https.createServer({
    key: fs.readFileSync(privateKey),
    cert: fs.readFileSync(certificatePem)
  }, app);
}

const bodyParser = require("body-parser");
const cors = require("cors");

module.exports = function () {
  app.use(bodyParser.json());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/user", userRoute);


  app.get("/", (req, res) => {
    res.send("welcome to backend");
  });
  const customExpress = Object.create(express().response, {
    data: {
      value(data, message = "success", status = true) {
        return this.type("json").json({
          status,
          data,
          message,
        });
      },
    },
    error: {
      value(error, message = "An error occured", code) {
        return this.status(code || 500).json({
          message,
          statusCode: -3,
          status: false,
          error,
        });
      },
    },
    errorMessage: {
      value(message = "API response message", code) {
        return this.status(code || 400).json({
          message,
          statusCode: 1,
          status: false,
        });
      },
    },
  });

  app.response = Object.create(customExpress);

  app.use(function (err, req, res, next) {
    logger.error(
      err.response
        ? [err.response.data.toString().split("\n")[0], req.originalUrl].join()
        : err.stack
          ? [err.toString().split("\n")[0], req.originalUrl].join()
          : [err.toString().split("\n")[0], req.originalUrl].join()
    );

    res.status(err?.response?.status || 500).send({
      mesage: "Internal Server Error",
      description: `Something broke!. Check application logs for helpful tips. OriginalUrl: ${req.originalUrl}`,
    });
  });

  // app.use(function (err, req, res, next) {
  //   logger.error(
  //     err.response ? err.response.data : err.stack ? err.stack : err
  //   );

  //   res.status(err?.response?.status || 500).send({
  //     mesage: err.response ? err.response.data : err.stack ? err.stack : err,
  //     description: `Something broke!. Check application logs for helpful tips. OriginalUrl: ${req.originalUrl}  `,
  //   });
  // });
  //   server.listen(PORT, () => {
  //     console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
  //   });

  return app;
};
