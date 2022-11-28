const Item = require("../models/item");
const Wardrobe = require("../models/wardrobe");

// const multer = require("multer");
// const {GridFSStorage}= require("multer-gridfs-storage")

exports.create = (req, res, next) => {
  console.log("CREATE OBJECT");
  console.log("\n\nREQ BODY IS: ", req.body);
  // req.test = "TESTING!!\n\n";
  req.data = null;
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
    // change order of upload and retrieve
    // image: req.user.image,
  });
  
  // Save
  item
  .save()
  .then((data) => {
    Wardrobe.findById(req.user.wardrobe).then((wardrobe) => {
        wardrobe.items.push(item);
        wardrobe.save();
        // res.send(data);
        console.log("\n\nDATA IS ", data);
        req.data = data["_id"];
        next();
      });
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
  
exports.uploadImage = (req,res, next) => {
  console.log("IN UPLOAD!",req.test);
  console.log("\n\nIN UPLOAD DATA IS:\n", req.data);
  // console.log("UPLOADING IMAGE! DATA IS : \n", res.data);
  // const db = clis.test is: ", req.test);
  // const bucket = new mongodb.GridFSBucket(db);
  // upload.single(req.image);
  // res.send(data);
}

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
      } else res.status(200).send({ message: "Item was updated successfully." });
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
