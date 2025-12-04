// models/attendance.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      // Attendance belongs to Admin (who recorded it)
      Attendance.belongsTo(models.AdminUser, {
        foreignKey: 'recordedById',
        as: 'recordedBy'
      });

      // Attendance has many MemberAttendance records
      Attendance.hasMany(models.MemberAttendance, {
        foreignKey: 'attendanceId',
        as: 'memberAttendances'
      });
    }

    // Static method for statistics
    static async getStatistics(period = 'month') {
      const { Op } = require('sequelize');
      let dateFilter = {};
      const now = new Date();

      switch (period) {
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          dateFilter = { date: { [Op.gte]: weekAgo } };
          break;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          dateFilter = { date: { [Op.gte]: monthAgo } };
          break;
        case 'year':
          const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
          dateFilter = { date: { [Op.gte]: yearAgo } };
          break;
      }

      return await this.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalRecords'],
          [sequelize.fn('SUM', sequelize.col('totalAttendance')), 'totalAttendance'],
          [sequelize.fn('AVG', sequelize.col('totalAttendance')), 'averageAttendance'],
          [sequelize.fn('MAX', sequelize.col('totalAttendance')), 'highestAttendance'],
          [sequelize.fn('MIN', sequelize.col('totalAttendance')), 'lowestAttendance']
        ],
        where: dateFilter,
        raw: true
      });
    }
  }

  Attendance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      serviceType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      totalAttendance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      adults: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      youth: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      children: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      visitors: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      recordedById: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'AdminUsers',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: "Attendance",
      timestamps: true,
      indexes: [
        {
          fields: ['date']
        },
        {
          fields: ['serviceType']
        },
        {
          fields: ['recordedById']
        }
      ]
    }
  );

  return Attendance;
};