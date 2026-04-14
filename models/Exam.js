// models/Exam.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exam = sequelize.define('Exam', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  subject_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.STRING(500) },
  duration_minutes: { type: DataTypes.INTEGER, allowNull: false },
  total_questions: { type: DataTypes.INTEGER, allowNull: false },
  created_by: { type: DataTypes.INTEGER }
}, {
  tableName: 'Exams',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Exam;