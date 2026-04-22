'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exam_Question extends Model {
    static associate(models) {
      // define association here
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