'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exam_Question extends Model {
    static associate(models) {
      Exam_Question.belongsTo(models.Exam, { foreignKey: 'exam_id' });
      Exam_Question.belongsTo(models.Question, { foreignKey: 'question_id' });
    }
  }
  Exam_Question.init({
    exam_id: DataTypes.INTEGER,
    question_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Exam_Question',
  });
  return Exam_Question;
};