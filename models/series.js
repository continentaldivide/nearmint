"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class series extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.series.belongsTo(models.user, {
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  series.init(
    {
      marvel_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      thumbnail_url: DataTypes.STRING,
      marvel_url: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "series",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return series;
};
