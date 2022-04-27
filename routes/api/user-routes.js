const router = require('express').Router();

// require the User and Post from the models folder to use the tables collumns 
const { User, Post } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {  // here we will send them everything from the database, only the password wont be added this endpoint
  // Access our User model and run .findAll() method)
  User.findAll({
    // here we will get all the data, expect the password , but even the password is excluded we still need to hash it 
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


// GET /api/users/1
router.get('/:id', (req, res) => {
  User.findOne({
    // here we will get one collumn in the user table, expect the password row 
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_url', 'created_at']
      }
    ]
  })
    //if the user is getting the wrong id, then it will give them a 404 error, user not found  
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



// POST /api/users
router.post('/', (req, res) => {
  // to create something, the body req should match the table collumns 
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
    // in mysql this will look like this:
    //     INSERT INTO users
    //          (username, email, password)
    //     VALUES
    //          ("Lernantino", "lernantino@gmail.com", "password1234");
});





// PUT /api/users/1
router.put('/:id', (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

  // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
  User.update(req.body, {
    // we need to include this while updating data, if there is a hach then run it first then send data back
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

    // this will look like that in mysql:
      // UPDATE users
      // SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
      // WHERE id = 1;
});






// DELETE /api/users/1
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




// verification of the userName and password
router.post('/login', (req, res) => {
  // expects {email: 'lernantino@gmail.com', password: 'password1234'}
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    res.json({ user: dbUserData, message: 'You are now logged in!' });
  });
});


module.exports = router;