const Wardrobe = require("../models/wardrobe");
const Style = require("../models/style");
const User = require("../models/user");

exports.create = (req, res) => {
  let styleObjectList = [];
  if (req.body.styles) {
    req.body.styles.map((style) => {
      Style.findOne({ name: style })
        .then((style) => {
          styleObjectList.push(style);
        })
        .catch((err) => {
          console.log("couldnt find ", style);
        });
    });
  }

  // Create a wardrobe
  const wardrobe = new Wardrobe({
    user: req.user._id,
    gender: [...req.body.gender],
    styles: styleObjectList,
  });

  // Save Wardrobe in the database
  wardrobe
    .save()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the wardrobe.",
      });
      return;
    });

  User.updateOne({ _id: req.user._id }, { wardrobe: wardrobe }, (err, doc) => {
    if (err) {
      console.log(err);
      return;
    }
    if (doc) {
      console.log("updated doc", doc);
    }
  });
};

exports.readOne = (req, res) => {
  const id = req.params.id;

  Wardrobe.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found wardrobe with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving wardrobe with id=" + id });
    });
};

exports.readAll = (req, res) => {
  Wardrobe.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving wardrobes.",
      });
    });
};

exports.updateOne = (req, res) => {
  const id = req.params.id;

  Wardrobe.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update wardrobe with id=${id}. Maybe wardrobe was not found!`,
        });
      } else res.send({ message: "Wardrobe was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating wardrobe with id=" + id,
      });
    });
};

exports.deleteOne = (req, res) => {
  const id = req.params.id;

  Wardrobe.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Wardrobe with id=${id}. Maybe Wardrobe was not found!`,
        });
      } else {
        res.send({
          message: "Wardrobe was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Wardrobe with id=" + id,
      });
    });
};
