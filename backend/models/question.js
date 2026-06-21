'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.belongsTo(models.Subject, { foreignKey: 'subject_id' });
      Question.belongsTo(models.Grade, { foreignKey: 'grade_id' });
      Question.hasMany(models.Resultdetail, { foreignKey: 'question_id' });
      Question.belongsTo(models.Status, { foreignKey: 'status_id' });

      Question.belongsToMany(models.Exam, {
        through: models.Exam_Question,
        foreignKey: 'question_id'
      });
    }
  }
  Question.init({
    subject_id: DataTypes.INTEGER,
    grade_id: DataTypes.INTEGER,
    content_img: DataTypes.STRING,
    content: DataTypes.STRING,
    option_a: DataTypes.STRING,
    option_b: DataTypes.STRING,
    option_c: DataTypes.STRING,
    option_d: DataTypes.STRING,
    answer_count: DataTypes.INTEGER,
    correct_answer: DataTypes.STRING,
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};