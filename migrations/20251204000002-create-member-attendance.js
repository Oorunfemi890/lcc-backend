// migrations/20251204000002-create-member-attendance.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MemberAttendances", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      attendanceId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Attendances',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      memberId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Members',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      present: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      timeArrived: {
        type: Sequelize.TIME,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
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
    await queryInterface.addIndex('MemberAttendances', ['attendanceId']);
    await queryInterface.addIndex('MemberAttendances', ['memberId']);
    await queryInterface.addIndex('MemberAttendances', ['attendanceId', 'memberId'], {
      unique: true,
      name: 'unique_attendance_member'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("MemberAttendances");
  }
};