"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.comic, {
        foreignKey: {
          name: "user_id",
        },
      });
      models.user.hasMany(models.series, {
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  user.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      collection_public: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "user",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return user;
};
