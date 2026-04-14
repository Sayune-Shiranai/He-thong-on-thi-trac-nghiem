const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExamQuestion = sequelize.define('ExamQuestion', {
  exam_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  question_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'ExamQuestions',
  timestamps: false  // Không có created_at, updated_at
});

module.exports = ExamQuestion;