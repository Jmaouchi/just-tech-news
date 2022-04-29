// import all models
const Post = require('./Post');
const User = require('./User');
const Vote = require('./Vote');
const Comment = require('./Comment');

// create associations
User.hasMany(Post, {
  foreignKey: 'user_id'
});

Post.belongsTo(User, {
  foreignKey: 'user_id'
});

User.belongsToMany(Post, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'user_id'
});

Post.belongsToMany(User, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'post_id'
});

Vote.belongsTo(User, {
  foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Vote, {
  foreignKey: 'user_id'
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});


// comment can belong to only one user
Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

// a comment can belong to only one post
Comment.belongsTo(Post, {
  foreignKey: 'post_id'
});

// a user can have many comments
User.hasMany(Comment, {
  foreignKey: 'user_id'
});


// a Post can have many comments 
Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

module.exports = { User, Post, Vote, Comment };