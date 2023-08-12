'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('comment_tables', 'id_content_tables',{
      type: Sequelize.INTEGER,
      allowNull:false,
      reference: {
        model: 'content_tables',
        key: 'id'
      }
    })

    await queryInterface.addColumn('comment_tables', 'id_user_logins',{
      type:Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: 'user_logins',
        key: 'id'
      }
    })

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.removeColumn('comment_tables', 'id_content_tables')
    await queryInterface.removeColumn('comment_tables', 'id_user_logins')

  }
};
