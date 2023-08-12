'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class like_tables extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  like_tables.init({
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
    id_content_tables : {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: 'content_tables',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'like_tables',
  });
  return like_tables;
};