const router = require('express').Router();

// get everything from the user-routes.js file, and we are exporting all the api routes 
const userRoutes = require('./user-routes');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');

// use this router that starts with /users then the end of this endpoint will be in the api routes 
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);


module.exports = router;