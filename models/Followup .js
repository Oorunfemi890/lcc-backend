"use strict";
const { Model } = require("sequelize");

// FollowUp Model
module.exports = (sequelize, DataTypes) => {
    class FollowUp extends Model {
        static associate(models) {
            // FollowUp belongs to FirstTimer
            FollowUp.belongsTo(models.FirstTimer, {
                foreignKey: 'firstTimerId',
                as: 'firstTimer'
            });

            // FollowUp belongs to Member (who is doing the follow-up)
            FollowUp.belongsTo(models.Member, {
                foreignKey: 'assignedToMemberId',
                as: 'assignedMember'
            });
        }
    }

    FollowUp.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            firstTimerId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'FirstTimers',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            assignedToMemberId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'Members',
                    key: 'id'
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE'
            },
            followUpType: {
                type: DataTypes.ENUM,
                values: ['phone_call', 'home_visit', 'church_visit', 'whatsapp', 'email'],
                allowNull: false
            },
            scheduledDate: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            completedDate: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM,
                values: ['scheduled', 'completed', 'missed', 'rescheduled', 'cancelled'],
                defaultValue: 'scheduled'
            },
            outcome: {
                type: DataTypes.ENUM,
                values: ['interested', 'not_interested', 'joined', 'needs_more_time', 'no_response'],
                allowNull: true
            },
            notes: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            nextFollowUpDate: {
                type: DataTypes.DATEONLY,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: "FollowUp",
            timestamps: true,
            indexes: [
                {
                    fields: ['firstTimerId']
                },
                {
                    fields: ['assignedToMemberId']
                },
                {
                    fields: ['status']
                },
                {
                    fields: ['scheduledDate']
                }
            ]
        }
    );

    return FollowUp;
};