// migrations/20251204000001-create-attendance.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Attendances", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      serviceType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      totalAttendance: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      adults: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      youth: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      children: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      visitors: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      recordedById: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'AdminUsers',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('Attendances', ['date']);
    await queryInterface.addIndex('Attendances', ['serviceType']);
    await queryInterface.addIndex('Attendances', ['recordedById']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Attendances");
  }
};