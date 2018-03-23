const User = require("../models/userModels");
const bcrypt = require("bcrypt");

const createUser = (req, res) => {
  const user = new User(req.user);
  user
    .save()
    .then(newUser => res.status(200).send(newUser))
    .catch(error =>
      res.status(500).json({ error: "Could not save user information" })
    );
  // create user takes in the username and password and saves a user.
  // our pre save hook should kick in here saving this user to the DB with an encrypted password.
};

module.exports = {
  createUser
};
