'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('content_tables','id_user_logins',{
      type:Sequelize.INTEGER,
      allowNull:false,
      reference: {
        model:'userLogins',
        key:'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.removeColumn('content_tables','id_user_logins')

  }
};
