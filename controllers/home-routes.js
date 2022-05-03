const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const router = require('express').Router();

router.get('/', (req, res) => {
  Post.findAll({
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      console.log(dbPostData[0]);
      // create a const variable to map through the data that we got from the get request then map through the data element by element 
      // 
      const posts = dbPostData.map(post => post.get({ plain: true }));
      // pass a single post object into the homepage template
      res.render('homepage', { posts });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;