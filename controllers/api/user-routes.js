const router = require('express').Router();
const { Post, User, Vote, Comment } = require("../../models");

// get all users
// EXMPL: this will happen if a user try to click on a button to get some data displayed, the frontEnd team will specify what they want to happen 
// while clicking on that button  
router.get('/', (req, res) => {
  // this will get all the data from the user table and it will exclude the password for us. 
  // but the password is still visible in the database, so we need to hash it 
  User.findAll({
    // exclude password
    attributes: { exclude: ['password'] }
  })
  // then send the data to the user as json 
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


// This will get us a sigle data by using an id 
// the the front_end team can display whaterver they want with a fetch request 
router.get('/:id', (req, res) => { 
  // this will give us a sigle data object from the user table, where the id is = to the req.params.id
  User.findOne({
    attributes: { exclude: ['password'] },
      where: {
        // the req.params.id id that id number from the client side, for exmpl a attr type will set to 2 when creating a button tag,
        // then this when we click on it, that attr number we be used as an id here to send data 
        id: req.params.id
      },
      //it will include all the post data from the post table and the comment table 
      include: [
        { //include the the id, title, post_url and created_at from the post table, this wont work if you dont add a association bettween these
          //tables, the association here is in the inde.js file and the user_id collumn in the post table, that will refers to the id of the user table
          model: Post, 
          attributes: ['id', 'title', 'post_url', 'created_at']
        },
        // include the Comment model here:
        { // in the comment table give me the id, comment_text and created_at  and include the title that is a forgein key from the post table
          // so if the user_id form the comment collumn is = to the id in the user tablem display that data  
          model: Comment,
          attributes: ['id', 'comment_text', 'created_at'],
          include: { // include means join 
            model: Post,
            attributes: ['title']
          }
        },
        { // 
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


// this post is to create a new user // for example someone trying to reate an account need to fill out a form. the data will be sent to the user table
// then send the data back as json 
router.post('/', (req, res) => {
  // in a post its always a create method that we need to use 
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  .then(dbUserData => {
    // method will initiate the creation of the session and then run the callback function once complete.
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
  
      res.json(dbUserData);
    });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});



// this when a user try to access to his account, he will try to  write his user_name and password to see if he get an account, if yes 
// render them whatever, html or a json data to the front_end team 
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
    // this function is in the user table 
    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }
    // This gives our server easy access to the user's user_id, username, and a Boolean describing whether or not the user is logged in
    // we always need to create our sessoin before we send a response back 
    req.session.save(() => {
      // declare session variables
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = false;

    res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });
})

// destroy the session to logout from the page
router.post('/logout', (req, res) => {

  if (req.session.loggedIn) {
    req.session.destroy(() => {
      // the 204 response means that the session has successfully been destroyed.
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }

});

// this will update data in the database, for example a user want to update something 
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



// this when a user want to delete something, clicking on a button or whatever
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
