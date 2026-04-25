'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.belongsTo(models.Subject, { foreignKey: 'subject_id' });
      Question.belongsTo(models.Grade, { foreignKey: 'grade_id' });

      Question.belongsToMany(models.Exam, {
        through: models.Exam_Question,
        foreignKey: 'question_id'
      });
    }
  }
  Question.init({
    content_img: DataTypes.STRING,
    content: DataTypes.STRING,
    option_a: DataTypes.STRING,
    option_b: DataTypes.STRING,
    option_c: DataTypes.STRING,
    option_d: DataTypes.STRING,
    correct_answer: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};