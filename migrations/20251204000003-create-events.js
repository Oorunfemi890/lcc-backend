// migrations/20251204000003-create-events.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Events", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      category: {
        type: Sequelize.ENUM(
          'Service',
          'Conference',
          'Seminar',
          'Workshop',
          'Outreach',
          'Fellowship',
          'Youth Event',
          'Children Event',
          'Prayer Meeting',
          'Special Program',
          'Other'
        ),
        allowNull: false
      },
      maxAttendees: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      currentAttendees: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isRecurring: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      recurringPattern: {
        type: Sequelize.ENUM('daily', 'weekly', 'monthly', 'yearly'),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
        defaultValue: 'upcoming'
      },
      registrationRequired: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      registrationDeadline: {
        type: Sequelize.DATE,
        allowNull: true
      },
      eventFee: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      organizerId: {
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
    await queryInterface.addIndex('Events', ['date', 'time']);
    await queryInterface.addIndex('Events', ['category']);
    await queryInterface.addIndex('Events', ['status']);
    await queryInterface.addIndex('Events', ['organizerId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Events");
  }
};