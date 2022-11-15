const User = require("../models/user");

exports.get = (req, res) => {
  User.findById(req.user.id).then((user) => {
    return res.status(200).json(user);
  });
};

const privateProjection =
  "firstName lastName username role created private hideWardrobe";
const followProjection = privateProjection + " posts followers following";
const fullProjection = followProjection + " wardrobe";

exports.readOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((user) => {
      if (!user)
        return res
          .status(404)
          .send({ message: "Not found user with id " + id });
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ message: "Error retrieving user with id=" + id });
    });
};

exports.readAll = (req, res) => {
  var users = [];
  User.find({ private: true }, privateProjection)
    .then((privateData) => {
      User.find({ private: false, hideWardrobe: true }, followProjection)
        .then((semiPublicData) => {
          User.find({ private: false, hideWardrobe: false }, fullProjection)
            .then((publicData) => {
              users = [...privateData, ...semiPublicData, ...publicData];
              return res.status(200).send(users);
            })
            .catch((err) => {
              return res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while retrieving fully public users.",
              });
            });
        })
        .catch((err) => {
          return res.status(500).send({
            message:
              err.message ||
              "Some error occurred while retrieving public users.",
          });
        });
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving private users.",
      });
    });
};

exports.updateOne = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Cannot update user with id=${id}. Maybe user was not found!`,
        });
      } else return res.send({ message: "User was updated successfully." });
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error updating user with id=" + id,
      });
    });
};

exports.deleteOne = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      } else {
        return res.send({
          message: "User was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

exports.follow = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  User.findById(id).then((user) => {
    var isInArray = false;
    var requests = user.recievedRequests.map((f) => f._id);
    var followers = user.followers.map((f) => f._id);
    if (user.private == true) {
      isInArray = requests.some((f) => {
        return f.equals(req.user._id);
      });
    } else {
      isInArray = followers.some((f) => {
        return f.equals(req.user._id);
      });
    }
    if (req.body.follow == "true") {
      if (isInArray) {
        console.log("Already following user!");
        return res.status(400).send({
          message: "Already following user!",
        });
      }

      User.findById(req.user._id).then((self) => {
        if (user._id == self._id) {
          console.log("Cannot follow yourself!");
          return res.status(400).send({
            message: "Cannot follow yourself!",
          });
        }

        if (user.private === true) {
          user.recievedRequests.push(self);
          self.sentRequests.push(user);
          user.save();
          self.save();
          return res.status(200).send({
            message: "Request sent!",
          });
        }

        user.followers.push(self);
        self.following.push(user);
        user.save();
        self.save();
        return res.status(200).send({
          message: "Followed!",
        });
      });
    } else {
      if (!isInArray) {
        console.log("You aren't following that user!");

        return res.status(400).send({
          message: "You aren't following that user!",
        });
      }

      User.findById(req.user._id).then((self) => {
        if (user.private === true) {
          user.recievedRequests.pull(self);
          self.sentRequests.pull(user);
          user.save();
          self.save();
          return res.status(200).send({
            message: "Request unsent!",
          });
        }

        user.followers.pull(self);
        self.following.pull(user);
        user.save();
        self.save();
      });
      return res.status(200).send({
        message: "Unfollowed!",
      });
    }
  });
};
