// models/event.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      // Event belongs to Admin (organizer)
      Event.belongsTo(models.AdminUser, {
        foreignKey: 'organizerId',
        as: 'organizer'
      });
    }

    // Instance methods
    isPast() {
      const eventDateTime = new Date(`${this.date} ${this.time}`);
      return eventDateTime < new Date();
    }

    isUpcoming() {
      return !this.isPast();
    }

    getDuration() {
      if (!this.endTime) return null;
      const start = new Date(`2000-01-01 ${this.time}`);
      const end = new Date(`2000-01-01 ${this.endTime}`);
      const diffMs = end - start;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffHours}h ${diffMinutes}m`;
    }

    // Static methods
    static async getUpcomingEvents(limit = 10) {
      const { Op } = require('sequelize');
      return await this.findAll({
        where: {
          date: { [Op.gte]: new Date() },
          status: 'upcoming'
        },
        order: [['date', 'ASC'], ['time', 'ASC']],
        limit,
        include: [
          {
            model: sequelize.models.AdminUser,
            as: 'organizer',
            attributes: ['id', 'email', 'role']
          }
        ]
      });
    }

    static async getStatistics() {
      const { Op } = require('sequelize');
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [totalEvents, upcomingEvents, completedEvents, thisMonthEvents] = await Promise.all([
        this.count(),
        this.count({
          where: {
            date: { [Op.gte]: now },
            status: 'upcoming'
          }
        }),
        this.count({ where: { status: 'completed' } }),
        this.count({
          where: {
            createdAt: { [Op.gte]: startOfMonth }
          }
        })
      ]);

      const categoryStats = await this.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['category'],
        raw: true
      });

      const statusStats = await this.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status'],
        raw: true
      });

      return [totalEvents, upcomingEvents, completedEvents, thisMonthEvents, categoryStats, statusStats];
    }
  }

  Event.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 200]
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: true
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true
      },
      category: {
        type: DataTypes.ENUM(
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
        type: DataTypes.INTEGER,
        allowNull: true
      },
      currentAttendees: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      isRecurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      recurringPattern: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
        defaultValue: 'upcoming'
      },
      registrationRequired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      registrationDeadline: {
        type: DataTypes.DATE,
        allowNull: true
      },
      eventFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      organizerId: {
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
      modelName: "Event",
      timestamps: true,
      indexes: [
        {
          fields: ['date', 'time']
        },
        {
          fields: ['category']
        },
        {
          fields: ['status']
        },
        {
          fields: ['organizerId']
        }
      ]
    }
  );

  return Event;
};