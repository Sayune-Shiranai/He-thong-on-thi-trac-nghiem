'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Teacher_Assignments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { 
          model: 'Users', 
          key: 'id' 
        },
        onDelete: 'CASCADE'
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
      status_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
          model: 'Statuses',
          key: 'id'
        },
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Teacher_Assignments');
  }
};