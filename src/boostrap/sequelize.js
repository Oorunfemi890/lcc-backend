const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../config/config.js")[env];
const { logger } = require("../logger/winston");

module.exports = function () {
  let sequelize;

  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    logging: (msg) => logger.debug(msg),
  });

  return {
    sequelize,
  };
};
