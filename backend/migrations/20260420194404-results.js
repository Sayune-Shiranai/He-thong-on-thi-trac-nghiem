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

      score: Sequelize.FLOAT,

      answers: Sequelize.STRING,

      createdAt: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Results');
  }
};

