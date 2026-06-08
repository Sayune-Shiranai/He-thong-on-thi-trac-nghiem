'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin',
        role_id: 1,
        img_avatar: null,
        img_background: null,
        status_id: 2,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'mod',
        email: 'mod@example.com',
        password: 'mod',
        role_id: 2,
        img_avatar: null,
        img_background: null,
        status_id: 2,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'teacher',
        email: 'teacher@example.com',
        password: 'teacher',
        role_id: 3,
        img_avatar: null,
        img_background: null,
        status_id: 2,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'student',
        email: 'student@example.com',
        password: 'student',
        role_id: 4,
        img_avatar: null,
        img_background: null,
        status_id: 2,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
