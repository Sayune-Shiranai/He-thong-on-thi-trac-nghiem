'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resultdetail extends Model {
    static associate(models) {
      Resultdetail.belongsTo(models.Result, {
        foreignKey: "result_id"
      });

      Resultdetail.belongsTo(models.Question, {
        foreignKey: "question_id"
      });
    }
  }
  Resultdetail.init({
    selected_answer: DataTypes.STRING,
    is_correct: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Resultdetail',
  });
  return Resultdetail;
};