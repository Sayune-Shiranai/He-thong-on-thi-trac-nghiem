'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Teacher_Assignments', [
      {
        user_id: 3,
        grade_id: 1,
        subject_id: 1,
        status_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Teacher_Assignments', null, {});
  }
};
