'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Subjects', [
      {
        name: 'Toán',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Lý',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Hóa',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Subjects', null, {});
  }
};
