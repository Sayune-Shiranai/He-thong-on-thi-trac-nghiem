'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher_Assignment extends Model {
    static associate(models) {
        Teacher_Assignment.belongsTo(models.User, { foreignKey: 'user_id' });
        Teacher_Assignment.belongsTo(models.Grade, { foreignKey: 'grade_id' });
        Teacher_Assignment.belongsTo(models.Subject, { foreignKey: 'subject_id' });
    }
  }
  Teacher_Assignment.init({
    user_id: {
      type: DataTypes.INTEGER,
    },

    grade_id: {
      type: DataTypes.INTEGER,
    },

    subject_id: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Teacher_Assignment',
  });
  return Teacher_Assignment;
};