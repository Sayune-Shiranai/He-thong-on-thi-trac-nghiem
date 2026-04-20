'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Exam_Questions', {
      id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      exam_id: {
        type: Sequelize.INTEGER,
        references: { 
          model: 'Exams', 
          key: 'id' 
        },
        onDelete: 'CASCADE'
      },
      question_id: {
        type: Sequelize.INTEGER,
        references: { 
          model: 'Questions', 
          key: 'id' 
        },
        onDelete: 'CASCADE'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Exam_Questions');
  }
};
