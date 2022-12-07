const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");

exports.validateSignUp = (req, res, next) => {
  let { email, firstName, lastName, acceptTerms, username, password } =
    req.body;

  //Check terms
  if (acceptTerms !== true)
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

  //Require strong password, default settings https://www.npmjs.com/package/validator
  if (password == null || !validator.isStrongPassword(password))
    return res.status(400).json({
      success: false,
      message: "PASSWORD",
    });

  return next();
};

exports.validateSignIn = (req, res, next) => {
  let { username, email } = req.body;
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

exports.authorize = async (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(401).json({
      success: false,
      message: "INVALID TOKEN",
    });
  }
  const access_token = req.headers["authorization"].split(" ")[1];
  if (access_token == null)
    return res.status(401).json({
      success: false,
      message: "INVALID TOKEN",
    });
  jwt.verify(
    access_token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err != null) return res.status(403).send("INVALID TOKEN 2");
      if (decoded == null) return res.status(403).send("INVALID TOKEN 3");

      const { id } = decoded;

      User.findById(id).then((user) => {
        if (user == null)
          return res.status(400).json({
            success: false,
            message: "INVALID TOKEN",
          });
        req.user = user;
        return next();
      });
    }
  );
};
