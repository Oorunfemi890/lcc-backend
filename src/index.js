import "core-js/stable";
import "regenerator-runtime/runtime";
require("dotenv").config();
const fs = require("fs");

const path = require(`path`);
const privateKey = (path.join(__dirname, "boostrap/private.key"));
const certificatePem = path.join(__dirname, "boostrap/certificate.pem");
const { sequelize, app } = require("./boostrap")();
const { stream } = require("./logger/winston");
const morgan = require("morgan");

let PORT = process.env.PORT
if (fs.existsSync(privateKey) && fs.existsSync(certificatePem)) {
  PORT = process.env.PORT_PROD
}
console.log(PORT)
app.use(morgan("combined", { stream: stream }));

(async function () {
  try {
    await sequelize.authenticate();

    console.log("Connection has been established successfully!");
    app.listen(PORT, () => {
      console.log(
        `⚡️[server]: Server is running at https://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export default app;
