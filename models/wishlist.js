'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class wishList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      wishList.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      wishList.belongsTo(models.Product, {foreignKey: "productId",as: 'product'});


    }
  };
  wishList.init({
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Product",
        key: "id",
      }
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
    }

  }, {
    sequelize,
    modelName: 'wishList',
  });
  return wishList;
};