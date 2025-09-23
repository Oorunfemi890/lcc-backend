"use strict";
const bcrypt = require("bcryptjs");
const db = require("../models");

const AdminUser = db.AdminUser;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * */
    const users = await AdminUser.findAll();

    if (users.length > 0) return;

    const hash = bcrypt.hashSync("admin123!", 8);

    await queryInterface.bulkInsert(
      "AdminUsers",
      [
        {
          email: "john.doe@yahoo.com",
          firstName: "John",
          lastName: "Doe",
          password: hash,
          phoneNumber: "07010671710",
          role: "SUPER ADMIN",
          countryCode: "+234",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(
      "AdminUsers",
      {
        email: "john.doe@yahoo.com",
      },
      {}
    );
  },
};
