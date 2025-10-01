"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Testimony extends Model {
    static associate(models) {
      // Testimony belongs to Member
      Testimony.belongsTo(models.Member, {
        foreignKey: 'memberId',
        as: 'member'
      });
    }
  }
  
  Testimony.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      memberId: {
        type: DataTypes.UUID,
        allowNull: true, // Allow null for non-members
        references: {
          model: 'Members',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
     
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10, 5000]
        }
      },
      category: {
        type: DataTypes.ENUM,
        values: ['healing', 'breakthrough', 'salvation', 'deliverance', 'provision', 'protection', 'restoration', 'answered_prayer', 'miracle', 'other'],
        allowNull: false
      },
      dateOfExperience: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
          isDate: true,
          isBefore: new Date().toISOString().split('T')[0]
        }
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }, 
      sharedInService: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      serviceSharedDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: "Testimony",
      tableName: "Testimonies",
      timestamps: true,
      indexes: [
        {
          fields: ['memberId']
        },
        {
          fields: ['category']
        },
        {
          fields: ['active']
        }
      ],
    }
  );
  
  return Testimony;
};