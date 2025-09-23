const  app  =  require("./express")();
const { sequelize } = require("./sequelize")();
const swaggerDocs = require("./swagger")();

module.exports = function () {
  return { app, sequelize };
};
