'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    static associate(models) {
      Subject.hasMany(models.Question, { foreignKey: 'subject_id' });
      Subject.hasMany(models.Exam, { foreignKey: 'subject_id' });
      Subject.hasMany(models.Teacher_Assignment, { foreignKey: 'subject_id' });
    }
  }
  Subject.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Subject',
  });
  return Subject;
};