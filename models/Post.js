const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');


// create our Post model
class Post extends Model {}

// create fields/columns for Post model // defined the post schema
Post.init(
  { // after we created the modul we need to create the collumns 
    //id collumn
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // title column 
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // post_url collumn 
    post_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isURL: true
      }
    },
    // foreign key
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  },
  { // configure the metadata, including the naming conventions.
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post'
  }
);



module.exports = Post;