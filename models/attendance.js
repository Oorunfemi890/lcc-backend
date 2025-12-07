"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Attendance extends Model {
        static associate(models) {
            // Define associations here if needed
            // e.g., Attendance.belongsTo(models.Service, { foreignKey: 'serviceId' });
        }
    }
    Attendance.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            serviceType: {
                type: DataTypes.ENUM,
                values: [
                    "Sunday Service",
                    "Digging Deep",
                    "Faith Clinic",
                    "Church Without Walls",
                    "Thanksgiving Service",
                    "New Year Service"
                ],
                allowNull: false,
                defaultValue: "Sunday Service"
            },
            menCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            womenCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            adultsCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            youthCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            visitorsCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            childrenCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            total: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            notes: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: "Attendance",
            tableName: "Attendances",
            timestamps: true,
            hooks: {
                beforeSave: (attendance) => {
                    // Auto-calculate total
                    attendance.total = (attendance.menCount || 0) + (attendance.womenCount || 0) +
                        (attendance.adultsCount || 0) + (attendance.youthCount || 0) +
                        (attendance.childrenCount || 0) + (attendance.visitorsCount || 0);
                }
            }
        }
    );
    return Attendance;
};
