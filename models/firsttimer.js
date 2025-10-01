"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class FirstTimer extends Model {
        static associate(models) {
            // FirstTimer has many FollowUps
            FirstTimer.hasMany(models.FollowUp, {
                foreignKey: 'firstTimerId',
                as: 'followUps'
            });
        }
    }

    FirstTimer.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            visitDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },

            // Reception Card Fields
            surname: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            otherNames: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            residenceAddress: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            nearestBusStop: {
                type: DataTypes.STRING,
                allowNull: true
            },
            officeAddress: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            whatsappNumber: {
                type: DataTypes.STRING,
                allowNull: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isEmail: true
                }
            },

            // Questions from Reception Card
            interestedInJoining: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            whereBestToMeet: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            welcomeToFellowship: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },

            // Demographics
            maritalStatus: {
                type: DataTypes.ENUM,
                values: ['single', 'married', 'divorced_separated', 'widowed'],
                allowNull: true
            },
            ageGroup: {
                type: DataTypes.ENUM,
                values: ['10-20', '21-30', '31-40', '41-50', '51-above'],
                allowNull: true
            },

            // Prayer Request
            prayerRequest: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            // Feedback Questions
            enjoyedMost: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            whatStoodOut: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            improvementSuggestions: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            futureTopicSuggestions: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            hospitalityFeedback: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            overallExperienceRating: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5
                }
            },
            likelihoodToReturn: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5
                }
            },
            wantMoreOf: {
                type: DataTypes.ENUM,
                values: ['worship', 'teaching', 'prayer', 'fellowship'],
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: "FirstTimer",
            tableName: "FirstTimers",
            timestamps: true
        }
    );

    return FirstTimer;
};