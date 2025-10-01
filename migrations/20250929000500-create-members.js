"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Members", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      countryCode: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "+234",
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      maritalStatus: {
        type: Sequelize.ENUM("single", "married", "divorced", "widowed"),
        allowNull: true,
      },
      occupation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      interests: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      memberSince: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      membershipType: {
        type: Sequelize.ENUM("member", "worker", "minister", "Pastor"),
        defaultValue: "member",
      },
      isWorker: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      emergencyContactName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emergencyContactPhone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emergencyContactRelationship: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profilePicture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("Members", ["email"], { unique: true });
    await queryInterface.addIndex("Members", ["firstName", "lastName"]);
    await queryInterface.addIndex("Members", ["memberSince"]);
    await queryInterface.addIndex("Members", ["active"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Members");
  },
};
