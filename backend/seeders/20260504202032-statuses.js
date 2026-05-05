'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Statuses', [
      {
        name: 'Pending',
        description: 'Chờ duyệt'
      },
      {
        name: 'Approved',
        description: 'Đã duyệt'
      },
      {
        name: 'Rejected',
        description: 'Hủy duyệt'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Statuses', null, {});
  }
};
