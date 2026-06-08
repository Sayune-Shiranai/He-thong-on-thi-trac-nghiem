'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ResultDetails', [
      {
        result_id: 1,
        question_id: 1,
        selected_answer: 'A',
        is_correct: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        result_id: 1,
        question_id: 2,
        selected_answer: 'C',
        is_correct: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ResultDetails', null, {});
  }
};
