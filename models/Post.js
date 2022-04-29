const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post model
class Post extends Model {
  static upvote(body, models) {
    return models.Vote.create({
      user_id: body.user_id,
      post_id: body.post_id
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id
        },
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [
            sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
            'vote_count'
          ]
        ]
      });
    });
  }
}

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
    // foreign key, and this wont work if the post.route wont have the include mehtode insude the get..
    user_id: { // we will name this user_id, and after we do add it in the post request it will check in the user table if its equal to the id,
      // if so then it will include whatever we want from that table.
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