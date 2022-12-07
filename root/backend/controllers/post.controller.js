const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const { uploadFile } = require("../utils/s3client");
const crypto = require("crypto");

exports.create = async (req, res) => {
  // Create a post
  var props = {
    user: req.user._id,
    text: req.body.caption,
    type: req.body.type,
  };
  var mediaData = {};
  switch (req.body.type) {
    case "outfit":
      mediaData.outfit = req.body.outfit;
      break;
    case "item":
      mediaData.item = req.body.item;
      break;
  }
  if (req.file) {
    const imageName = crypto.randomBytes(32).toString("hex");
    props = { ...props, imageName: imageName };
    await uploadFile(req.file.buffer, imageName, req.file.mimetype).catch(
      (err) => {
        console.log(err);
        return res.status(400).send({ message: "failed to upload image" });
      }
    );
  } else {
    console.log("img fail");
    return res.status(500).send({
      message: err.message || "No image found.",
    });
  }

  const post = new Post({ ...props, ...mediaData });

  // Save
  post
    .save()
    .then((data) => {
      User.findById(req.user).then((user) => {
        user.posts.push(post);
        user.save();
        return res.status(200).send(data);
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: err.message || "Some error occurred while creating the post.",
      });
    });
};

exports.readOne = (req, res) => {
  const id = req.params.id;

  Post.findById(id)
    .populate(
      "user",
      "firstName lastName username role created private hideWardrobe"
    )
    .populate(
      "item",
      "name type imageName category subcategories brand colors pattern material fit"
    )
    .then((data) => {
      if (!data)
        return res
          .status(404)
          .send({ message: "Not found post with id " + id });
      else {
        return res.status(200).send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving post with id=" + id });
    });
};

exports.readAll = (req, res) => {
  Post.find({
    $match: {
      created: {
        $gte: Date.now() - 7 * 60 * 60 * 24 * 1000,
      },
    },
  })
    .populate(
      "user",
      "firstName lastName username role created private hideWardrobe"
    )
    .then((data) => {
      filtered_posts = data.filter((post) => !post.user.private);
      console.log(filtered_posts);
      return res.status(200).send(filtered_posts.map((p) => p._id));
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving posts.",
      });
    });
};

exports.readAllFollowing = (req, res) => {
  Post.find({
    $match: {
      created: {
        $gte: Date.now() - 7 * 60 * 60 * 24 * 1000,
      },
    },
  })
    .then((data) => {
      filtered_posts = data.filter((post) =>
        req.user.following.includes(post.user)
      );
      console.log(filtered_posts);
      return res.status(200).send(filtered_posts.map((p) => p._id));
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
        return res.status(404).send({
          message: `Cannot update post with id=${id}. Maybe post was not found!`,
        });
      } else return res.send({ message: "Post was updated successfully." });
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error updating post with id=" + id,
      });
    });
};

exports.deleteOne = (req, res) => {
  const id = req.params.id;

  Post.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Cannot delete Post with id=${id}. Maybe Post was not found!`,
        });
      } else {
        return res.status(200).send({
          message: "Post was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Could not delete Post with id=" + id,
      });
    });
};

exports.comment = (req, res) => {};
exports.updateComment = (req, res) => {};
exports.deleteComment = (req, res) => {};
