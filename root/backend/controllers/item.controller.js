const Item = require("../models/item");

exports.create = (req, res) => {
  // Create a item
  const item = new Item({
    accessory: req.body.accessory,
    slot: [req.body.slot], //list of slots the item occupies/covers
    brand: req.body.brand,
    size: req.body.size,
    colors: req.body.colors,
    pattern: req.body.pattern,
    material: req.body.material,
    fit: req.body.fit, //tight, well, loose
    category: req.body.category,
    wardrobe: req.user.wardrobe,
  });

  // Save
  Item.save(item)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the item.",
      });
    });
};

exports.readOne = (req, res) => {
  const id = req.params.id;

  Item.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found item with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving item with id=" + id });
    });
};

exports.readAll = (req, res) => {
  Item.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving items.",
      });
    });
};

exports.updateOne = (req, res) => {
  const id = req.params.id;

  Item.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update item with id=${id}. Maybe item was not found!`,
        });
      } else res.send({ message: "Item was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating item with id=" + id,
      });
    });
};

exports.deleteOne = (req, res) => {
  const id = req.params.id;

  Item.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Item with id=${id}. Maybe Item was not found!`,
        });
      } else {
        res.send({
          message: "Item was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Item with id=" + id,
      });
    });
};
