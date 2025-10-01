// Program Model (Standalone)
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Program extends Model {
    static associate(models) {

    }
  }
  
  Program.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100]
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      category: {
        type: DataTypes.ENUM,
        values: ['youth', 'children', 'bible_study', 'fellowship', 'outreach', 'prayer', 'special_event', 'ministry'],
        allowNull: false
      },
      targetAudience: {
        type: DataTypes.STRING,
        allowNull: true // e.g., "Adults", "Youth 18-35", "Children 5-12"
      },
      frequency: {
        type: DataTypes.ENUM,
        values: ['weekly', 'monthly', 'quarterly', 'annually', 'one_time'],
        allowNull: false,
        defaultValue: 'weekly'
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: true
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: true
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true
      },
     
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      requirements: {
        type: DataTypes.TEXT,
        allowNull: true // Special requirements or prerequisites
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Program",
      tableName: "Programs",
      timestamps: true,
      indexes: [
        {
          fields: ['category']
        },
        {
          fields: [ 'startTime']
        },
        {
          fields: ['startDate', 'endDate']
        }
      ]
    }
  );

  // Instance methods


  return Program;
};

