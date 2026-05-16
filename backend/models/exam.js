'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exam extends Model {
    static associate(models) {
      Exam.belongsTo(models.Subject, { foreignKey: 'subject_id' });
      Exam.belongsTo(models.Grade, { foreignKey: 'grade_id' });
      Exam.belongsTo(models.User, { foreignKey: 'user_id' });

      Exam.belongsToMany(models.Question, {
        through: models.Exam_Question,
        foreignKey: 'exam_id'
      });

      Exam.hasMany(models.Result, { foreignKey: 'exam_id' });
    }
  }
  Exam.init({
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Exam',
  });
  return Exam;
};