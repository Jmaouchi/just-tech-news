const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our comment model
class Comment extends Model {}

// create fields/columns for Post model // defined the post schema
Comment.init(
  { // after we created the modul we need to create the collumns 
    //id collumn
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // post_url collumn 
    comment_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // foreign key, and this wont work if the post.route wont have the include mehtode insude the get..
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'post',
        key: 'id'
      }
    }
  },
  { // configure the metadata, including the naming conventions.
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment'
  }
);



module.exports = Comment;