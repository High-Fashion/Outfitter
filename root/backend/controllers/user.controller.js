const User = require("../models/user");

exports.readAll = (req, res) => {
  res.status(302).json({ message: "Users found!" });
};

exports.readOne = (req, res) => {
  res.status(302).json({ message: "User found!" });
};

exports.updateOne = (req, res) => {
  res.status(301).json({ message: "User updated!" });
};

exports.deleteOne = (req, res) => {
  res.status(202).json({ message: "User deleted!" });
};
