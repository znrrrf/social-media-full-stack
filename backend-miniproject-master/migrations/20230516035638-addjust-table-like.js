'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.removeColumn('like_tables','name')

    await queryInterface.addColumn('like_tables','id_user_logins',{
      type: Sequelize.INTEGER,
      allowNull:false,
      reference: {
        model: 'user_logins',
        key:'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })

    await queryInterface.addColumn('like_tables','id_content_tables',{
      type: Sequelize.INTEGER,
      allowNull:false,
      reference: {
        model: 'content_tables',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('like_tables','name',{
      type: Sequelize.INTEGER
  })

  await queryInterface.removeColumn('like_tables','id_user_logins')
  await queryInterface.removeColumn('like_tables','id_content_tables')


  }
};
