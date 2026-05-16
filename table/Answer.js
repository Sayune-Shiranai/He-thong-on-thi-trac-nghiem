// // models/Answer.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Answer = sequelize.define('Answer', {
//   id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//   question_id: { type: DataTypes.INTEGER, allowNull: false },
//   answer_text: { type: DataTypes.STRING(500), allowNull: false },
//   is_correct: { type: DataTypes.BOOLEAN, defaultValue: false },
//   answer_order: { type: DataTypes.INTEGER, allowNull: false }
// }, {
//   tableName: 'Answers',
//   timestamps: false
// });

// module.exports = Answer;