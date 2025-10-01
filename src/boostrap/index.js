const  app  =  require("./express")();
const { sequelize } = require("./sequelize")();

module.exports = function () {
  return { app, sequelize };
};
