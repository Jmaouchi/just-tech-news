const router = require('express').Router();
const { Post, User, Vote, Comment } = require("../../models");

// get all users
router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => { 
  User.findOne({
    attributes: { exclude: ['password'] },
      where: {
        id: req.params.id
      },
      include: [
        { //include the the id, title, post_url and created_at from the post table
          model: Post, 
          attributes: ['id', 'title', 'post_url', 'created_at']
        },
        // include the Comment model here:
        { //include the the id, comment_text and created_at from the Comment table
          model: Comment,
          attributes: ['id', 'comment_text', 'created_at'],
          include: { // include means join 
            model: Post,
            attributes: ['title']
          }
        },
        { 
          model: Post,
          attributes: ['title'],
          through: Vote,
          as: 'voted_posts'
        }
      ]
    })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // in a post its always a create method that we need to use 
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }
    //since the password is hashed, we can not check it, cause it will be different in the database
    // what we need to id is to run a function called checkPasswod and then call  bcrypt.compareSync method to hash the password and then compare
    // it, if its the same, then login 
    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    res.json({ user: dbUserData, message: 'You are now logged in!' });
  });
});

router.put('/:id', (req, res) => {

  // pass in req.body instead to only update what's passed through
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
