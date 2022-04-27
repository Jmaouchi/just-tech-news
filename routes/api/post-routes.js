const router = require('express').Router();
const { Post, User } = require('../../models');
const { route } = require('./user-routes');


// get all users // and remember that Post is the name of our table 
router.get('/', (req, res) => {
  Post.findAll({
    // Query configuration
    attributes: ['id', 'post_url', 'title', 'created_at'],
    //this will order the data by time while displaying it to the user, (the last post will be displayed first)
    order: [['created_at', 'DESC']], 
    // this will work cause in out post modul we added a foreign key to be able to inhirt from the user modul while id = post_id 
    include: [  // this include is the same as join with sql ( left join, inner join ...)
      {
        model: User,
        attributes: ['username']
      }
    ]
//     INSERT INTO post (title, post_url, user_id, created_at, updated_at)
// VALUES ("Taskmaster goes public!", "https://taskmaster/press", 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  })
  .then(dbPostData => res.json(dbPostData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
})



// get a single post in  to the Post table
router.get('/:id', (req, res) => {
  // in the post table finde one column where the req.params.id is the same than the id of that collumn
  // then give us the id, post_url, title, created_at and the iclude the username inside the user table, if the id of 
  // the collumn in the post table is equal to the id in the user table, then send back the response as json 
                                                       //MORE INFO//
  //Notice that there are only differences, namely the use of the findOne method and the use of the req.params to retrieve 
  //the id property from the route. We used the where property to set the value of the id using req.params.id. We are requesting 
  //the same attributes, including the username which requires a reference to the User model using the include property.

  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'post_url', 'title', 'created_at'],
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});



// post a new post to the Post table 
router.post('/', (req, res) => {
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    user_id: req.body.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Update a post
router.put('/:id', (req, res) => {
  Post.update(
    {
      title: req.body.title
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});



//delete a post
router.delete('/:id', (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;