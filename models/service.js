// ProgramMember Junction Table
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Service extends Model {

        /**
      * Helper method for defining associations.
      * This method is not a part of Sequelize lifecycle.
      * The `models/index` file will call this method automatically.
      */
        static associate(models) {

        }

    }

    Service.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 200]
                }
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            serviceDate: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            startTime: {
                type: DataTypes.TIME,
                allowNull: false
            },
            endTime: {
                type: DataTypes.TIME,
                allowNull: true
            },
            location: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'Main Sanctuary'
            },
            serviceType: {
                type: DataTypes.ENUM,
                values: ['sunday_worship', 'bible_study', 'prayer_meeting', 'youth_service', 'special_service', 'baptism', 'communion', 'wedding', 'funeral', 'dedication'],
                defaultValue: 'sunday_worship'
            },
            frequency: {
                type: DataTypes.ENUM,
                values: ['weekly', 'monthly', 'quarterly', 'special', 'one_time'],
                defaultValue: 'weekly'
            },
            dayOfWeek: {
                type: DataTypes.ENUM,
                values: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                allowNull: true
            },
            scripture: {
                type: DataTypes.STRING,
                allowNull: true // Bible verse reference
            },
            audioRecordingUrl: {
                type: DataTypes.STRING,
                allowNull: true
            },
            videoRecordingUrl: {
                type: DataTypes.STRING,
                allowNull: true
            },
            liveBroadcastUrl: {
                type: DataTypes.STRING,
                allowNull: true
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: true
            },
            notes: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            isRecurring: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            sequelize,
            modelName: "Service",
            tableName: "Services",
            timestamps: true,
            indexes: [
                {
                    fields: ['serviceDate', 'startTime']
                },

                {
                    fields: ['serviceType']
                },
                {
                    fields: ['active']
                },
                {
                    fields: ['dayOfWeek']
                }
            ]
        }
    );

    // Instance methods
    Service.prototype.isUpcoming = function () {
        const now = new Date();
        const serviceDateTime = new Date(`${this.serviceDate} ${this.startTime}`);
        return serviceDateTime > now;
    };

    Service.prototype.getDuration = function () {
        if (!this.endTime) return null;
        const start = new Date(`2000-01-01 ${this.startTime}`);
        const end = new Date(`2000-01-01 ${this.endTime}`);
        const diffMs = end - start;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffHours}h ${diffMinutes}m`;
    };

    return Service;
};