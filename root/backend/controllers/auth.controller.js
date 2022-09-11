const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.signup = (req, res) => {
  let { email, firstName, lastName, acceptTerms, username, password } =
    req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err | (hash == null))
      return res.status(400).json({
        success: false,
        message: "TRY AGAIN 1",
      });
    const user = new User({
      email: email,
      firstName: firstName,
      lastName: lastName,
      acceptTerms: acceptTerms,
      username: username,
      hashedPassword: hash,
    });
    User.create(user, (newUser) => {
      if (newUser == null)
        return res.status(400).json({
          success: false,
          message: "TRY AGAIN 2",
        });
      return res.status(201).json({
        success: true,
        message: "New user created!",
      });
    });
  });
};

exports.signin = (req, res) => {
  let { email, username, password } = req.body;
  let filter = { email: email };
  if (email == null) filter = { username: username };
  User.findOne(filter).then((user) => {
    console.log(user);
    if (user == null)
      return res.status(400).json({
        success: false,
        message: "INVALID 1",
      });
    bcrypt.compare(password, user.hashedPassword, (err, success) => {
      if (err || success === false)
        return res.status(400).json({
          success: false,
          message: "INVALID 2",
        });
      console.log("Successfully signed in ", user.username);
      //TODO: Attach cookie
      return res.status(200).json({
        success: true,
        message: "SUCCESS",
      });
    });
  });
};

exports.signout = (req, res) => {
  return res.status(404).json({
    success: false,
    message: "TODO",
  });
};
