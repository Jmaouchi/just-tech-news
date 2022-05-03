const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
// middlewares 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// set up express handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);

// turn on connection to db and server // and force to true means that This allows the table to be overwritten and re-created 
//if there is any changes
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});