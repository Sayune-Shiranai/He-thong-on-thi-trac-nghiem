'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Questions', {
      id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      content_img: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      content: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      option_a: { 
        type: Sequelize.STRING, 
        allowNull: true
      },
      option_b: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      option_c: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      option_d: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      answer_count: { 
        type: Sequelize.INTEGER, 
        allowNull: true,
      },
      correct_answer: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      grade_id: {
        type: Sequelize.INTEGER,
        references: { 
          model: 'Grades', 
          key: 'id' 
        },
      onDelete: 'CASCADE'
      },
      subject_id: {
        type: Sequelize.INTEGER,
        references: { 
          model: 'Subjects', 
          key: 'id' 
        },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('Questions');
  }
};
