'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment_tables extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  comment_tables.init({
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_content_tables: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'content_tables',
        key:'id'
      }
    },
    id_user_logins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model:'user_logins',
        key:'id'
      }
    }
  }, {
    sequelize,
    modelName: 'comment_tables',
  });
  return comment_tables;
};