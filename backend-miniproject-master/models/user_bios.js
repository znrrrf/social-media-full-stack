'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_bios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_bios.init({
    fullname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userdate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hobby: {
      type: DataTypes.STRING,
      allowNull:false
    },
    pic: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_user_logins: {
      type:DataTypes.STRING,
      allowNull:false,
      unique: true,
      references:{
        model: 'user_logins',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'user_bios',
  });
  return user_bios;
};