const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");

exports.create = (req, res) => {
  // Create a post
  const postData = {
    user: req.user.id,
    text: req.body.type,
    type: req.body.type,
    likes: [],
    comments: [],
  };
  const mediaData = {};
  switch (req.body.type) {
    case "photo":
      mediaData.photo = req.body.photo;
    case "outfit":
      mediaData.outfit = req.body.outfit;
      break;
    case "item":
      mediaData.item = req.body.item;
      break;
  }

  const post = new Post({ ...postData, ...mediaData });

  // Save
  post
    .save()
    .then((data) => {
      User.findById(req.user).then((user) => {
        user.posts.push(post);
        user.save();
        res.send(data);
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the post.",
      });
    });
};

exports.readOne = (req, res) => {
  const id = req.params.id;

  Post.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found post with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving post with id=" + id });
    });
};

exports.readAll = (req, res) => {
  Post.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving posts.",
      });
    });
};

exports.updateOne = (req, res) => {
  const id = req.params.id;

  Post.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update post with id=${id}. Maybe post was not found!`,
        });
      } else res.send({ message: "Post was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating post with id=" + id,
      });
    });
};

exports.deleteOne = (req, res) => {
  const id = req.params.id;

  Post.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Post with id=${id}. Maybe Post was not found!`,
        });
      } else {
        res.send({
          message: "Post was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Post with id=" + id,
      });
    });
};

exports.comment = (req, res) => {};
exports.updateComment = (req, res) => {};
exports.deleteComment = (req, res) => {};
