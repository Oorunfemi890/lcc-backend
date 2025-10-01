"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Celebrants", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      celebrationType: {
        type: Sequelize.ENUM(
          "birthday",
          "baptism",
          "wedding",
          "graduation",
          "newborn",
          "anniversary",
          "promotion",
          "ordination",
          "other"
        ),
        allowNull: false,
      },
      celebrationDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contactType: {
        type: Sequelize.ENUM("phone", "email", "whatsapp"),
        defaultValue: "phone",
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      specialRequests: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      photoUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      submittedBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      submitterContact: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      relationship: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      // Extra fields implied from model logic (status, scheduledFor, isRecurring, priority, celebratedOn, celebratedBy)
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "pending",
      },
      scheduledFor: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      isRecurring: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      celebratedOn: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      celebratedBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Indexes
    await queryInterface.addIndex("Celebrants", ["celebrationType"]);
    await queryInterface.addIndex("Celebrants", ["celebrationDate"]);
    await queryInterface.addIndex("Celebrants", ["status"]);
    await queryInterface.addIndex("Celebrants", ["scheduledFor"]);
    await queryInterface.addIndex("Celebrants", ["isRecurring"]);
    await queryInterface.addIndex("Celebrants", ["priority"]);
    await queryInterface.addIndex("Celebrants", ["active"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Celebrants");
  },
};
