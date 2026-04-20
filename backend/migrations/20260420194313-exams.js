'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Exams', {
      id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      title: { 
        type: Sequelize.STRING, 
        allowNull: false 
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
      created_by: {
        type: Sequelize.INTEGER,
        references: { 
          model: 'Users', 
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
    await queryInterface.dropTable('Exams');
  }
};
