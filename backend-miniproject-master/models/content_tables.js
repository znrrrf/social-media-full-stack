'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class content_tables extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  content_tables.init({
    content_pic: {
      type:DataTypes.STRING,
      allowNull:false
    },
    caption: {
      type:DataTypes.STRING,
      allowNull:false
    },
    like_point: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    id_user_logins: {
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model: 'user_logins',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {
    sequelize,
    modelName: 'content_tables',
  });
  return content_tables;
};