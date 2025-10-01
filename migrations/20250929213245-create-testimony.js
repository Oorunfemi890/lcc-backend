"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Testimonies", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      memberId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Members",
          key: "id"
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM,
        values: [
          "healing",
          "breakthrough",
          "salvation",
          "deliverance",
          "provision",
          "protection",
          "restoration",
          "answered_prayer",
          "miracle",
          "other"
        ],
        allowNull: false
      },
      dateOfExperience: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      sharedInService: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      serviceSharedDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });

    // Indexes
    await queryInterface.addIndex("Testimonies", ["memberId"]);
    await queryInterface.addIndex("Testimonies", ["category"]);
    await queryInterface.addIndex("Testimonies", ["active"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Testimonies");
  }
};
