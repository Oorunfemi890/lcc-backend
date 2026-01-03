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

            // FollowUp belongs to Member (as target)
            FollowUp.belongsTo(models.Member, {
                foreignKey: 'targetMemberId',
                as: 'targetMember'
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
                allowNull: true,
                references: {
                    model: 'FirstTimers',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            targetMemberId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'Members',
                    key: 'id'
                },
                onDelete: 'SET NULL',
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
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: false,
                defaultValue: [],
                validate: {
                    isValidTypes(value) {
                        const validTypes = ['phone_call', 'home_visit', 'church_visit', 'whatsapp', 'email', 'sms'];
                        if (!Array.isArray(value) || value.length === 0) {
                            throw new Error('followUpType must be a non-empty array');
                        }
                        for (const type of value) {
                            if (!validTypes.includes(type)) {
                                throw new Error(`Invalid followUpType: ${type}`);
                            }
                        }
                    }
                }
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