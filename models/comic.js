"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.comic.belongsTo(models.user, {
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  comic.init(
    {
      marvel_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      series: DataTypes.STRING,
      issue_number: DataTypes.INTEGER,
      thumbnail_url: DataTypes.STRING,
      marvel_url: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      owned: DataTypes.BOOLEAN,
      wishlist: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "comic",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return comic;
};
