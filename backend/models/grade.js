'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Grade extends Model {
    static associate(models) {
      Grade.hasMany(models.Question, { foreignKey: 'grade_id' });
      Grade.hasMany(models.Exam, { foreignKey: 'grade_id' });
    }
  }
  Grade.init({
    grade: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Grade',
  });
  return Grade;
};