const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { randomBytes } = require("crypto");
const User = require("../models/user");
const RefreshToken = require("../models/refresh_token");

exports.signup = (req, res) => {
  let { email, firstName, lastName, acceptTerms, username, password } =
    req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err || hash == null)
      return res.status(400).json({
        success: false,
        message: "Failed to hash password",
      });
    const user = new User({
      email: email,
      firstName: firstName,
      lastName: lastName,
      acceptTerms: acceptTerms,
      username: username,
      hashedPassword: hash,
    });
    User.create(user, (err) => {
      if (err != null)
        return res.status(400).json({
          success: false,
          message: "Failed to store user in database",
        });
      return res.status(201).json({
        success: true,
        message: "New user created!",
      });
    });
  });
};

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

const generateRefreshToken = (user) => {
  const token = randomBytes(40).toString("hex");
  return new RefreshToken({
    user: user,
    token: token,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
    bcrypt.compare(password, user.hashedPassword, async (err, success) => {
      if (err || success === false)
        return res.status(400).json({
          success: false,
          message: "INVALID 2",
        });
      console.log("Successfully signed in ", user.username);

      const access_token = generateAccessToken(user);
      const refresh_token = generateRefreshToken(user);
      const signed_refresh_token = jwt.sign(
        { refresh_token: refresh_token.token },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      // save refresh token
      await refresh_token.save();

      return res.status(200).json({
        access_token: access_token,
        refresh_token: signed_refresh_token,
        success: true,
        message: "Welcome back " + user.username,
      });
    });
  });
};

exports.signout = (req, res) => {
  jwt.verify(
    req.body.refresh_token,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err != null || decoded == null)
        return res.status(401).json({
          success: false,
          message: "INVALID TOKEN",
        });
      //Update old refresh token from database
      const old_refresh_token = await getRefreshToken(decoded);
      old_refresh_token.revoked = Date.now();
      await old_refresh_token.save();
      return res.status(200).json({
        success: true,
        message: "Successfully logged out.",
      });
    }
  );
};

const getRefreshToken = async (token) => {
  const refresh_token = await RefreshToken.findOne({ token: token }).populate(
    "user"
  );
  return refresh_token;
};

exports.refresh = async (req, res) => {
  //Verify old refresh token
  jwt.verify(
    req.body.refresh_token,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err != null || decoded == null)
        return res.status(401).json({
          success: false,
          message: "INVALID TOKEN",
        });
      //Get old refresh token from database
      const old_refresh_token = await getRefreshToken(decoded.refresh_token);
      const { user } = old_refresh_token;
      const new_refresh_token = generateRefreshToken(user);

      //Sign new refresh token
      const signed_refresh_token = jwt.sign(
        { refresh_token: new_refresh_token.token },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      );

      //Update old refresh token
      old_refresh_token.revoked = Date.now();
      old_refresh_token.replacedByToken = new_refresh_token.token;
      await old_refresh_token.save();

      await new_refresh_token.save();

      //Generate new access token
      const new_access_token = generateAccessToken(user);

      return res.status(200).json({
        success: true,
        message: "Refreshed token.",
        access_token: new_access_token,
        refresh_token: signed_refresh_token,
      });
    }
  );
};
