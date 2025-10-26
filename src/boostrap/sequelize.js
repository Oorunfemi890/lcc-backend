const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../repository/database.config.js")[env];
const { logger } = require("../logger/winston");

module.exports = function () {
  let sequelize;

  // Option 1: Use DATABASE_URL if available (recommended for Supabase)

  if (config.DATABASE_URL) {
      console.log("config.DATABASE", config);

    sequelize = new Sequelize(config.DATABASE_URL, {
      dialect: config.dialect,
      dialectOptions: config.dialectOptions,
      logging: (msg) => logger.debug(msg),
    });
  } else {
    // Option 2: Use individual parameters
    sequelize = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      dialect: config.dialect,
      dialectOptions: config.dialectOptions,
      logging: (msg) => logger.debug(msg),
    });
  }

  return {
    sequelize,
  };
};