'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Resultdetails', {
      id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      result_id: {
        type: Sequelize.INTEGER,
        references: { 
          model: 'Results', 
          key: 'id' 
        },
        onUpdate: 'CASCADE'
      },
      question_id: {
        type: Sequelize.INTEGER,
        references: { 
          model: 'Questions', 
          key: 'id' 
        },
        onUpdate: 'CASCADE'
      },

      selected_answer: {
        type: Sequelize.STRING,
        allowNull: true
      },

      is_correct: {
        type: Sequelize.BOOLEAN,
        allowNull: true
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
    await queryInterface.dropTable('Resultdetails');
  }
};
