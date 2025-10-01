import "core-js/stable";
import "regenerator-runtime/runtime";
require("dotenv").config();

const { sequelize, app } = require("./boostrap")();
const { stream ,logger} = require("./logger/winston");
const morgan = require("morgan");
const http = require('http');

let PORT = process.env.PORT

app.use(morgan("combined", { stream: stream }));

(async function () {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully!");

  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();


const server = http.createServer(app).listen(PORT || 3000, () => {
  logger.info('Your app is listening on port ' + server.address().port);
});


export default server;
