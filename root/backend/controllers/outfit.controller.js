const Outfit = require("../models/outfit");
const Wardrobe = require("../models/wardrobe");
const Item = require("../models/item");
const { uploadFile } = require("../utils/s3client");
const crypto = require("crypto");

exports.create = async (req, res) => {
  console.log("CREATE OUTFIT");
  // Create a outfit
  let props = { ...req.body, user: req.user._id };

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
      if (!data) res.status(404).send({ message: "Not found outfit" });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving outfit" });
    });
};

const { spawn } = require("child_process");

function changeColorCodes(item) {
  const colorCodes = require("../utils/colors.json")["codes"];
  let newItem = item;
  if (newItem.colors.primary) {
    newItem.colors.primary = colorCodes[newItem.colors.primary];
  }
  if (newItem.colors.secondary) {
    newItem.colors.secondary = colorCodes[newItem.colors.secondary];
  }
  if (newItem.colors.tertiary) {
    newItem.colors.tertiary = colorCodes[newItem.colors.tertiary];
  }
  return newItem;
}

function changeColorCodesOutfit(outfit) {
  let newOutfit = {
    ...outfit,
    hair: outfit["hair"].map((item) => changeColorCodes(item)),
    head: outfit["head"].map((item) => changeColorCodes(item)),
    eyes: outfit["eyes"].map((item) => changeColorCodes(item)),
    nose: outfit["nose"].map((item) => changeColorCodes(item)),
    ear: {
      left: outfit["ear"]["left"].map((item) => changeColorCodes(item)),
      right: outfit["ear"]["right"].map((item) => changeColorCodes(item)),
    },
    mouth: outfit["mouth"].map((item) => changeColorCodes(item)),
    neck: outfit["neck"].map((item) => changeColorCodes(item)),
    torso: outfit["torso"].map((item) => changeColorCodes(item)),
    back: outfit["back"].map((item) => changeColorCodes(item)),
    left: {
      upper_arm: outfit["left"]["upper_arm"].map((item) =>
        changeColorCodes(item)
      ),
      forearm: outfit["left"]["forearm"].map((item) => changeColorCodes(item)),
      wrist: outfit["left"]["wrist"].map((item) => changeColorCodes(item)),
      hand: {
        thumb: outfit["left"]["hand"]["thumb"].map((item) =>
          changeColorCodes(item)
        ),
        index: outfit["left"]["hand"]["index"].map((item) =>
          changeColorCodes(item)
        ),
        middle: outfit["left"]["hand"]["middle"].map((item) =>
          changeColorCodes(item)
        ),
        ring: outfit["left"]["hand"]["ring"].map((item) =>
          changeColorCodes(item)
        ),
        pinky: outfit["left"]["hand"]["pinky"].map((item) =>
          changeColorCodes(item)
        ),
      },
      thigh: outfit["left"]["thigh"].map((item) => changeColorCodes(item)),
      ankle: outfit["left"]["ankle"].map((item) => changeColorCodes(item)),
    },
    right: {
      upper_arm: outfit["right"]["upper_arm"].map((item) =>
        changeColorCodes(item)
      ),
      forearm: outfit["right"]["forearm"].map((item) => changeColorCodes(item)),
      wrist: outfit["right"]["wrist"].map((item) => changeColorCodes(item)),
      hand: {
        thumb: outfit["right"]["hand"]["thumb"].map((item) =>
          changeColorCodes(item)
        ),
        index: outfit["right"]["hand"]["index"].map((item) =>
          changeColorCodes(item)
        ),
        middle: outfit["right"]["hand"]["middle"].map((item) =>
          changeColorCodes(item)
        ),
        ring: outfit["right"]["hand"]["ring"].map((item) =>
          changeColorCodes(item)
        ),
        pinky: outfit["right"]["hand"]["pinky"].map((item) =>
          changeColorCodes(item)
        ),
      },
      thigh: outfit["right"]["thigh"].map((item) => changeColorCodes(item)),
      ankle: outfit["right"]["ankle"].map((item) => changeColorCodes(item)),
    },
    legs: outfit["legs"].map((item) => changeColorCodes(item)),
    waist: outfit["waist"].map((item) => changeColorCodes(item)),
    hips: outfit["hips"].map((item) => changeColorCodes(item)),
    feet: outfit["feet"].map((item) => changeColorCodes(item)),
  };
  return newOutfit;
}

exports.generateSimilarOutfits = async (req, res) => {
  const id = req.params.id;

  let desired = await Outfit.findById(id);
  if (!desired) {
    return res.status(500).send({ message: "Error finding outfit." });
  }
  desired = changeColorCodesOutfit(desired.toObject());

  const wardrobe = req.user.wardrobe;
  if (!wardrobe) {
    return res.status(500).send({ message: "Error finding wardrobe." });
  }
  let tops = [];
  let bottoms = [];
  let shoes = [];
  let accessories = [];
  let one_pieces = [];

  wardrobe.items.forEach((item) => {
    let newItem = item.toObject();
    newItem = changeColorCodes(newItem);

    delete newItem["__v"];
    switch (item.type) {
      case "top":
        tops.push(newItem);
        break;
      case "bottoms":
        bottoms.push(newItem);
        break;
      case "shoes":
        shoes.push(newItem);
        break;
      case "accessory":
        accessories.push(newItem);
        break;
      case "one_piece":
        one_pieces.push(newItem);
        break;
      default:
        break;
    }
  });
  console.log("starting");
  let py = spawn("python3", ["python/recommend/recommend_outfit.py"], {
    shell: true,
  });
  py.stdout.setEncoding("utf8");
  let jsonOut = "";
  let outfits = await new Promise((resolve) => {
    py.stdout.on("data", function (data) {
      console.log("stdout:\n" + data);
      switch (data) {
        case "desired_outfit":
          py.stdin.write(JSON.stringify(desired) + "\n");
          break;
        case "tops":
          py.stdin.write(JSON.stringify(tops) + "\n");
          break;
        case "bottoms":
          py.stdin.write(JSON.stringify(bottoms) + "\n");
          break;
        case "shoes":
          py.stdin.write(JSON.stringify(shoes) + "\n");
          break;
        case "accessories":
          py.stdin.write(JSON.stringify(accessories) + "\n");
          break;
        case "one_pieces":
          py.stdin.write(JSON.stringify(one_pieces) + "\n");
          break;
        default:
          jsonOut = data;
          let outfits = JSON.parse(jsonOut);
          resolve(outfits);
      }
    });
    py.stderr.on("data", function (data) {
      console.log("stderr: " + data);
    });
  });
  let newOutfits = await Promise.all(
    outfits.map((outfit) => {
      return new Promise((resolve) => {
        const props = {
          torso: outfit.tops,
          legs: outfit.bottoms,
          feet: outfit.shoes,
        };
        Object.forEach(outfit).map((slot) => {
          if (["tops", "bottoms", "one_pieces", "feet"].includes(slot)) return;
          props[slot] = outfit[slot];
        });
        Outfit.create(props).then((newOutfit) => {
          Outfit.findById(newOutfit._id)
            .populate("hair")
            .populate("head")
            .populate("eyes")
            .populate("nose")
            .populate("ear")
            .populate("mouth")
            .populate("neck")
            .populate("torso")
            .populate("back")
            .populate("left")
            .populate("right")
            .populate("legs")
            .populate("waist")
            .populate("hips")
            .populate("feet")
            .then((pop) => {
              resolve(pop);
            });
        });
      });
    })
  );
  res.status(200).json(newOutfits);
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
  [
    "hair",
    "head",
    "eyes",
    "nose",
    "ear",
    "mouth",
    "neck",
    "torso",
    "back",
    "left",
    "right",
    "legs",
    "waist",
    "hips",
    "feet",
  ].forEach((slot) => {
    if (!Object.keys(req.body).includes(slot)) {
      req.body[slot] = [];
    }
  });
  console.log(req.body);
  Outfit.findByIdAndUpdate(id, { $set: { ...req.body } })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Cannot update outfit. Maybe item was not found!`,
        });
      }
      return res
        .status(200)
        .send({ message: "Outfit was updated successfully." });
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error updating outfit",
      });
    });
};

exports.deleteOne = (req, res) => {
  const id = req.params.id;

  Outfit.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Outfit. Maybe Outfit was not found!`,
        });
      } else {
        res.send({
          message: "Outfit was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Outfit",
      });
    });
};

exports.copy = (req, res) => {
  const id = req.params.id;
  Outfit.findById(id)
    .then((data) => {
      if (!data) res.status(404).send({ message: "Not found outfit" });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving outfit" });
    });
};
