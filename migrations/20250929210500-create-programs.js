"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Programs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      category: {
        type: Sequelize.ENUM(
          "youth",
          "children",
          "bible_study",
          "fellowship",
          "outreach",
          "prayer",
          "special_event",
          "ministry"
        ),
        allowNull: false,
      },
      targetAudience: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      frequency: {
        type: Sequelize.ENUM(
          "weekly",
          "monthly",
          "quarterly",
          "annually",
          "one_time"
        ),
        allowNull: false,
        defaultValue: "weekly",
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      requirements: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex("Programs", ["category"]);
    await queryInterface.addIndex("Programs", ["startTime"]);
    await queryInterface.addIndex("Programs", ["startDate", "endDate"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Programs");
  },
};
