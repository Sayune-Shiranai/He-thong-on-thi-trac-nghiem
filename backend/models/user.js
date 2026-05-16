'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'role_id' });
      User.belongsTo(models.Status, { foreignKey: 'status_id' });

      User.hasMany(models.Exam, { foreignKey: 'user_id' });
      User.hasMany(models.Result, { foreignKey: 'user_id' });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    img_avatar: DataTypes.STRING,
    img_background: DataTypes.STRING,

    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    refreshToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};