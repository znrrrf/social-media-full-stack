'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.removeColumn('content_tables','name');

    await queryInterface.addColumn('content_tables', 'content_pic', {
      type: Sequelize.STRING,
      allowNull: false
    })

    await queryInterface.addColumn('content_tables', 'caption',{
      type: Sequelize.STRING,
      allowNull:false,
    })

    await queryInterface.addColumn('content_tables', 'like_point', {
      type:Sequelize.INTEGER,
      allowNull: false
    })

    await queryInterface.addColumn('content_tables','id_user_logins',{
      type:Sequelize.INTEGER,
      allowNull:false,
      unique:true,
      reference: {
        model:'userLogins',
        key:'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('content_tables','name')

  }
};
