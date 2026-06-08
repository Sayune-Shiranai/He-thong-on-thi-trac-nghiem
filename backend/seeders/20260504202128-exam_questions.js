'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Exam_Questions', [
      {
        exam_id: 1,
        question_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        exam_id: 1,
        question_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Exam_Questions', null, {});
  }
};