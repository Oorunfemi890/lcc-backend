"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Attendances", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      serviceType: {
        type: Sequelize.ENUM(
          "Sunday Service",
          "Digging Deep",
          "Faith Clinic",
          "Church Without Walls",
          "Thanksgiving Service",
          "New Year Service"
        ),
        allowNull: false,
        defaultValue: "Sunday Service"
      },
      menCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      womenCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      childrenCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Attendances");
  }
};
