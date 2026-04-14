// models/Subject.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subject = sequelize.define('Subject', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.STRING(500) }
}, {
  tableName: 'Subjects',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Subject;