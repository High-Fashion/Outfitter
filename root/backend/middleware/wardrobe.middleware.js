exports.validateCreateWardrobe = (req, res, next) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  if (!req.body.gender) {
    res.status(400).send({ message: "Wardrobe must include gender." });
    return;
  }
  if (req.body.gender.length == 1) {
    if (
      !req.body.gender.includes("mens") &&
      !req.body.gender.includes("womens")
    ) {
      res.status(400).send({
        message: "gender must be a list containing 'mens' and or 'womens'",
      });
      return;
    }
  }
  next();
};

exports.validateUpdateWardrobe = (req, res, next) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  next();
};

exports.validateCreateItem = (req, res, next) => {
  // Validate request
  if (!req.body.colors) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  next();
};

exports.validateUpdateItem = (req, res, next) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  next();
};

exports.validateCreateOutfit = (req, res, next) => {
  next();
}

exports.validateUpdateOutfit = (req, res, next) => {
  next();
};
