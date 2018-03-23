const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/userModels");
const SaltRounds = 11;
const { mysecret } = require("../../config");

const authenticate = (req, res, next) => {
  // You won't need to change anything in this file here.
  const token = req.get("Authorization");
  if (token) {
    jwt.verify(token, mysecret, (err, decoded) => {
      if (err) return res.status(422).json(err);
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(403).json({
      error: "No token provided, must be set on the Authorization Header"
    });
  }
};

const encryptUserPW = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(404).json({ error: "You did not put a password" });
  }
  bcrypt
    .hash(password, SaltRounds)
    .then(hashedPassword => {
      req.user = { username, password: hashedPassword }.next();
    })
    .catch(error => res.status(500).json({ error: "Hashing failure" }));
};

const compareUserPW = (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      bcrypt
        .compare(password, user.password)
        .then(match => {
          if (match) {
            req.username = user.username;
            next();
          }
        })
        .catch(error => res.status(500).json({ error: "Cant find user info" }));
    })
    .catch(error => res.status(404).json({ error: "Can't find the user" }));
};

module.exports = {
  authenticate,
  encryptUserPW,
  compareUserPW
};
