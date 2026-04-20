'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Grades', {
      id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      grade: { 
        type: Sequelize.INTEGER, 
        unique: true 
      },
      createdAt: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
      },
      updatedAt: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Subjects');
  }
};
