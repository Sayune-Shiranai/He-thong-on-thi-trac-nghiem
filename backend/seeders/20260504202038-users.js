'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('123456', 10);
    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: passwordHash,
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
        password: passwordHash,
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
        password: passwordHash,
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
        password: passwordHash,
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
