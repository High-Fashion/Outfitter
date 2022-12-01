const Outfit = require("../models/outfit");
const Wardrobe = require("../models/wardrobe");
const { uploadFile } = require("../utils/s3client");
const crypto = require("crypto");

exports.create = async (req, res) => {
  console.log("CREATE OUTFIT");
  // Create a outfit
  var props = { ...req.body, user: req.user._id };

  if (req.file) {
    const imageName = crypto.randomBytes(32).toString("hex");
    props = { ...props, imageName: imageName };
    await uploadFile(req.file.buffer, imageName, req.file.mimetype).catch(
      (err) => console.log(err)
    );
  }

  const outfit = new Outfit(props);

  // Save
  outfit
    .save()
    .then((data) => {
      Wardrobe.findById(req.user.wardrobe).then((wardrobe) => {
        wardrobe.outfits.push(outfit);
        wardrobe.save();
        res.send(data);
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the outfit.",
      });
    });
};

exports.readOne = (req, res) => {
  const id = req.params.id;

  Outfit.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found outfit with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving outfit with id=" + id });
    });
};

exports.readAll = (req, res) => {
  Outfit.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving outfits.",
      });
    });
};

exports.updateOne = (req, res) => {
  const id = req.params.id;

  Outfit.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update outfit with id=${id}. Maybe outfit was not found!`,
        });
      } else res.send({ message: "Outfit was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating outfit with id=" + id,
      });
    });
};

exports.deleteOne = (req, res) => {
  const id = req.params.id;

  Outfit.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Outfit with id=${id}. Maybe Outfit was not found!`,
        });
      } else {
        res.send({
          message: "Outfit was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Outfit with id=" + id,
      });
    });
};

exports.copy = (req, res) => {
  const id = req.params.id;
  Outfit.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found outfit with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving outfit with id=" + id });
    });
};
