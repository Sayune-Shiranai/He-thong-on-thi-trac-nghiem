// models/index.js
const User = require('./User');
const Subject = require('./Subject');
const Topic = require('./Topic');
const Question = require('./Question');
const Answer = require('./Answer');
const Exam = require('./Exam');
const ExamQuestion = require('./ExamQuestion');
const UserExamResult = require('./UserExamResult');
const UserAnswer = require('./UserAnswer');

// Subject - Topic
Subject.hasMany(Topic, { foreignKey: 'subject_id' });
Topic.belongsTo(Subject, { foreignKey: 'subject_id' });

// Topic - Question
Topic.hasMany(Question, { foreignKey: 'topic_id' });
Question.belongsTo(Topic, { foreignKey: 'topic_id' });

// Question - Answer
Question.hasMany(Answer, { foreignKey: 'question_id' });
Answer.belongsTo(Question, { foreignKey: 'question_id' });

// Exam - Subject
Exam.belongsTo(Subject, { foreignKey: 'subject_id' });
Subject.hasMany(Exam, { foreignKey: 'subject_id' });

// Exam - Questions (Many-to-Many qua ExamQuestions)
Exam.belongsToMany(Question, { through: ExamQuestion, foreignKey: 'exam_id' });
Question.belongsToMany(Exam, { through: ExamQuestion, foreignKey: 'question_id' });

// User - ExamResults
User.hasMany(UserExamResult, { foreignKey: 'user_id' });
UserExamResult.belongsTo(User, { foreignKey: 'user_id' });

// Exam - ExamResults
Exam.hasMany(UserExamResult, { foreignKey: 'exam_id' });
UserExamResult.belongsTo(Exam, { foreignKey: 'exam_id' });

// UserExamResult - UserAnswers
UserExamResult.hasMany(UserAnswer, { foreignKey: 'result_id' });
UserAnswer.belongsTo(UserExamResult, { foreignKey: 'result_id' });

module.exports = {
  sequelize,
  User, Subject, Topic, Question, Answer,
  Exam, ExamQuestion, UserExamResult, UserAnswer
};