"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("FollowUps", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      firstTimerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "FirstTimers",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      assignedToMemberId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Members",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      followUpType: {
        type: Sequelize.ENUM(
          "phone_call",
          "home_visit",
          "church_visit",
          "whatsapp",
          "email"
        ),
        allowNull: false,
      },
      scheduledDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      completedDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          "scheduled",
          "completed",
          "missed",
          "rescheduled",
          "cancelled"
        ),
        defaultValue: "scheduled",
      },
      outcome: {
        type: Sequelize.ENUM(
          "interested",
          "not_interested",
          "joined",
          "needs_more_time",
          "no_response"
        ),
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      nextFollowUpDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // Add indexes
    await queryInterface.addIndex("FollowUps", ["firstTimerId"]);
    await queryInterface.addIndex("FollowUps", ["assignedToMemberId"]);
    await queryInterface.addIndex("FollowUps", ["status"]);
    await queryInterface.addIndex("FollowUps", ["scheduledDate"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("FollowUps");
  },
};
