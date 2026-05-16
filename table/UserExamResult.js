// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const UserExamResult = sequelize.define('UserExamResult', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   user_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   exam_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   score: {
//     type: DataTypes.DECIMAL(5, 2)
//   },
//   total_correct: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0
//   },
//   total_questions: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0
//   },
//   start_time: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   },
//   end_time: {
//     type: DataTypes.DATE
//   },
//   completed: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false
//   }
// }, {
//   tableName: 'UserExamResults',
//   timestamps: true,
//   createdAt: 'created_at',
//   updatedAt: false
// });

// module.exports = UserExamResult;