const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

// create our User model. this is the same then doing class User {then inside we will have a constructor ..} in OOP 
class User extends Model {
    // set up method to run on instance data (per user) to check password
    // this to check the password if a user choose to update it 
    checkPassword(loginPw) {
      return bcrypt.compareSync(loginPw, this.password);
    }
}

// define table columns and configuration
User.init(
  {
    // define an ID column
    id: { // use the special Sequelize DataTypes object provide what type of data it is
      type: DataTypes.INTEGER,
      allowNull: false,
      // If we didn't define the model to have a primaryKey option set up anywhere, Sequelize would create one for us
      primaryKey: true,
      autoIncrement: true
    },
    // define a username column
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // define an email column
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // there cannot be any duplicate email values in this table
      unique: true,
      // if allowNull is set to false, we can run our data through validators before creating the table data
      // if the email wont include the @, then its false, or forger the .com ...
      validate: {
        isEmail: true
      }
    },
    // define a password column
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // this means the password must be at least four characters long
        len: [4]
      }
    }
  },
  {
    hooks: {
      // set up beforeCreate lifecycle "hook" functionality
      // we also used the async/await method to call this function befor anything else 
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      // set up beforeUpdate lifecycle "hook" functionality
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
  }
    },
    sequelize,// this will connect the server to the db using sequelize 
    timestamps: false, 
    freezeTableName: true, // if not this will add an s at the end of the table name/ dont change anything and freez the table
    underscored: true, //In Sequelize, columns are camelcase by default.
    modelName: 'user' // table name 
  }
);


module.exports = User;