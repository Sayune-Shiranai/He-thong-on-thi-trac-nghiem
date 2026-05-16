'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Results', {
      id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { 
          model: 'Users', 
          key: 'id' 
        },
        onUpdate: 'CASCADE'
      },
      exam_id: {
        type: Sequelize.INTEGER,
        references: { 
          model: 'Exams', 
          key: 'id' 
        },
        onUpdate: 'CASCADE'
      },

      total_score: {
        type: Sequelize.FLOAT,
        allowNull: true
      },

      total_question: {
        type: Sequelize.STRING,
        allowNull: true
      },

      started_at: {
        type: Sequelize.DATE,
        allowNull: true
      },

      submitted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },

      duration: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Results');
  }
};

