"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AdminUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // AdminUser belongs to Member
      AdminUser.belongsTo(models.Member, {
        foreignKey: 'memberId',
        as: 'member', // alias for the association
        onDelete: 'CASCADE', // optional: what to do if Member is deleted
        onUpdate: 'CASCADE'  // optional: what to do if Member ID is updated
      });
    }
  }
  AdminUser.init(
    {
      password: {
        type: DataTypes.STRING,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      role: {
        type: DataTypes.ENUM,
        values: ["SUPER_ADMIN", "ADMIN", "EDITOR", "EDITOR"],
        defaultValue: "ADMIN",
      },
      memberId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Members', // name of the target table
          key: 'id'         // key in the target table that we're referencing
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'  // optional: behavior when referenced record is updated
      },
    },
    {
      sequelize,
      modelName: "AdminUser",
      tableName: "AdminUser",
      timestamps: true,
    }
  );
  return AdminUser;
};