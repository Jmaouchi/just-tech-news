const Sequelize = require('sequelize');

require('dotenv').config();

// create connection to our db, to create that we need a database name, database username and passsword
// we user dotenv to let our infos to stay away from github 
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

module.exports = sequelize;