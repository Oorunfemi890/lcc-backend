const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

import { logger } from "../logger/winston";
const customExpress = require("../validation/express.validation");


import authRoute from "../routes/auth.route";
import member from '../routes/member.route';
import celebrant from '../routes/member.route'
import firsttimer from '../routes/first-timer.route';
import followup from '../routes/follow-up.route';
import program from '../routes/program.route';
import service from '../routes/service.route';
import testimony from '../routes/testimony.route';
import heroslide from '../routes/hero-slide.route'

module.exports = function () {
  app.use(bodyParser.json());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/member", member);
  app.use("/api/v1/celebrant", celebrant);
  app.use("/api/v1/firsttimer", firsttimer);
  app.use("/api/v1/followup", followup);
  app.use("/api/v1/program", program);
  app.use("/api/v1/service", service);
  app.use("/api/v1/testimony", testimony);
  app.use("/api/v1/hero-slider",heroslide);



  app.set('view engine', 'ejs');



  app.get("/health-check", (req, res) => {
    res.send("OK");
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

  return app;
};
