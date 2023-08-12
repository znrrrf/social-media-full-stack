'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.removeColumn('user_bios', 'fullname');
    await queryInterface.removeColumn('user_bios', 'address');
    await queryInterface.removeColumn('user_bios', 'userdate');
    await queryInterface.removeColumn('user_bios', 'hobby');
    await queryInterface.removeColumn('user_bios', 'pic');
    await queryInterface.removeColumn('user_bios', 'id_user_logins');

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('user_bios', 'fullname', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('user_bios', 'address', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('user_bios', 'userdate', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('user_bios', 'hobby', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('user_bios', 'pic', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('user_bios', 'id_user_logins', {
      type: Sequelize.INTEGER
    });

  }
};
