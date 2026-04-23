'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Exam_Questions', {
      id: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true 
      },
      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: 'Exams', 
          key: 'id' 
        },
        onUpdate: 'CASCADE'
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: 'Questions', 
          key: 'id' 
        },
        onUpdate: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Exam_Questions');
  }
};
