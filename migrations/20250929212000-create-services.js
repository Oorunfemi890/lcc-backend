"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Services", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      serviceDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Main Sanctuary",
      },
      serviceType: {
        type: Sequelize.ENUM(
          "sunday_worship",
          "bible_study",
          "prayer_meeting",
          "youth_service",
          "special_service",
          "baptism",
          "communion",
          "wedding",
          "funeral",
          "dedication"
        ),
        allowNull: false,
        defaultValue: "sunday_worship",
      },
      frequency: {
        type: Sequelize.ENUM("weekly", "monthly", "quarterly", "special", "one_time"),
        allowNull: false,
        defaultValue: "weekly",
      },
      dayOfWeek: {
        type: Sequelize.ENUM(
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday"
        ),
        allowNull: true,
      },
      scripture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      audioRecordingUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      videoRecordingUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      liveBroadcastUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isRecurring: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addIndex("Services", ["serviceDate", "startTime"]);
    await queryInterface.addIndex("Services", ["serviceType"]);
    await queryInterface.addIndex("Services", ["active"]);
    await queryInterface.addIndex("Services", ["dayOfWeek"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Services");
  },
};
