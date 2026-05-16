'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    static associate(models) {
      Result.belongsTo(models.User, { foreignKey: 'user_id' });
      Result.belongsTo(models.Exam, { foreignKey: 'exam_id' });
      Result.hasMany(models.Resultdetail, { foreignKey: 'result_id' });
    }
  }
  Result.init({
    total_score: DataTypes.FLOAT,
    total_question: DataTypes.STRING,
    started_at: DataTypes.DATE,
    submitted_at: DataTypes.DATE,
    duration: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Result',
  });
  return Result;
};