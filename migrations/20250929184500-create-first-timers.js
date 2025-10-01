"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("FirstTimers", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      visitDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      otherNames: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      residenceAddress: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      nearestBusStop: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      officeAddress: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      whatsappNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      interestedInJoining: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      whereBestToMeet: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      welcomeToFellowship: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      maritalStatus: {
        type: Sequelize.ENUM("single", "married", "divorced_separated", "widowed"),
        allowNull: true,
      },
      ageGroup: {
        type: Sequelize.ENUM("10-20", "21-30", "31-40", "41-50", "51-above"),
        allowNull: true,
      },
      prayerRequest: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      enjoyedMost: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      whatStoodOut: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      improvementSuggestions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      futureTopicSuggestions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      hospitalityFeedback: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      overallExperienceRating: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      likelihoodToReturn: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      wantMoreOf: {
        type: Sequelize.ENUM("worship", "teaching", "prayer", "fellowship"),
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("FirstTimers");
  },
};
