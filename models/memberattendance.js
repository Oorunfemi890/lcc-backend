// models/memberattendance.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MemberAttendance extends Model {
    static associate(models) {
      // MemberAttendance belongs to Attendance
      MemberAttendance.belongsTo(models.Attendance, {
        foreignKey: 'attendanceId',
        as: 'attendance'
      });

      // MemberAttendance belongs to Member
      MemberAttendance.belongsTo(models.Member, {
        foreignKey: 'memberId',
        as: 'member'
      });
    }
  }

  MemberAttendance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      attendanceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Attendances',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      memberId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Members',
          key: 'id'
        }
      },
      present: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      timeArrived: {
        type: DataTypes.TIME,
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "MemberAttendance",
      timestamps: true,
      indexes: [
        {
          fields: ['attendanceId']
        },
        {
          fields: ['memberId']
        }
      ]
    }
  );

  return MemberAttendance;
};