'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    static associate(models) {
      Status.hasMany(models.User, { foreignKey: 'status_id' });
    }
  }
  Status.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Status',
  });
  return Status;
};