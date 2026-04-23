'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    static associate(models) {
      Result.belongsTo(models.User, { foreignKey: 'user_id' });
      Result.belongsTo(models.Exam, { foreignKey: 'exam_id' });
    }
  }
  Result.init({
    score: DataTypes.FLOAT,
    answers: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Result',
  });
  return Result;
};