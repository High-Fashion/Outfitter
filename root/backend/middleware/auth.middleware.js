const jwt = require("jsonwebtoken");
const validator = require("validator");
const { options } = require("../routes/user.routes");

exports.validateSignUp = (req, res, next) => {
  let { email, firstName, lastName, acceptTerms, username, password } =
    req.body;

  //Check terms
  if (acceptTerms != true)
    return res.status(400).json({
      success: false,
      message: "TERMS",
    });

  //Require email address
  if (!validator.isEmail(email))
    return res.status(400).json({
      success: false,
      message: "EMAIL",
    });

  //TODO: Require unique email address

  //Require first and last name to be only letters
  if (firstName == null || !validator.isAlpha(firstName))
    return res.status(400).json({
      success: false,
      message: "FIRST_NAME",
    });
  if (lastName == null || !validator.isAlpha(lastName))
    return res.status(400).json({
      success: false,
      message: "LAST_NAME",
    });

  //Exclude protected routes /users/signin, ect.
  if (["signin", "signup", "signout"].includes(username))
    return res.status(400).json({
      success: false,
      message: "USERNAME",
    });

  //Require username to be handle-like
  if (
    username == null ||
    !validator.isAlphanumeric(validator.blacklist(username, "._/-"))
  )
    return res.status(400).json({
      success: false,
      message: "USERNAME",
    });

  //TODO: Require unique username

  //Require strong password, default settings https://www.npmjs.com/package/validator
  if (password == null || !validator.isStrongPassword(password))
    return res.status(400).json({
      success: false,
      message: "PASSWORD",
    });

  return next();
};

exports.validateSignIn = (req, res, next) => {
  let { username, email, password } = req.body;
  if (email != null) {
    //Use email to login
    return next();
  }
  if (username == null)
    return res.status(400).json({
      success: false,
      message: "USERNAME/EMAIL",
    });
  // Use username to login
  return next();
};

exports.authenticate = (req, res, next) => {
  return next();
};
