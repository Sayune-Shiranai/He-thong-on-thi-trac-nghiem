'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Statuses', [
      {
        name: 'Pending',
        description: 'Chờ duyệt',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Approved',
        description: 'Đã duyệt',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Rejected',
        description: 'Hủy duyệt',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Statuses', null, {});
  }
};
