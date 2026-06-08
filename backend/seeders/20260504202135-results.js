'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const started = new Date();
    const submitted = new Date(started.getTime() + 30 * 60 * 1000);
    await queryInterface.bulkInsert('Results', [
      {
        user_id: 4,
        exam_id: 1,
        total_score: 50,
        started_at: started,
        submitted_at: submitted,
        duration: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Results', null, {});
  }
};
