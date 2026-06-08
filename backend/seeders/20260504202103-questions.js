'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Questions', [
      //tạo câu hỏi thủ công
      {
        content: 'Câu hỏi 1',
        option_a: 'Đáp án A',
        option_b: 'Đáp án B',
        option_c: 'Đáp án C',
        option_d: 'Đáp án D',
        correct_answer: 'A',
        grade_id: 1,
        subject_id: 1,
        status_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content: 'Câu hỏi 2',
        option_a: 'Đáp án A',
        option_b: 'Đáp án B',
        option_c: 'Đáp án C',
        option_d: 'Đáp án D',
        correct_answer: 'B',
        grade_id: 1,
        subject_id: 1,
        status_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Questions', null, {});
  }
};
