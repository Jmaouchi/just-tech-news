// import all models
const Post = require('./Post');
const User = require('./User');

// create associations
// user can have may posts where the 
User.hasMany(Post, {
  foreignKey: 'user_id'
});

// posts can have only one user 
Post.belongsTo(User, {
  foreignKey: 'user_id'
});


module.exports = { User, Post };
