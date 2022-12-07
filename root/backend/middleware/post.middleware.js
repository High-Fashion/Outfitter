exports.validateCreatePost = (req, res, next) => {
  if (!req.body.data) {
    console.log("fail");
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  req.body = JSON.parse(req.body.data);
  next();
};

exports.validateUpdatePost = (req, res, next) => {
  next();
};

exports.validateCreateComment = (req, res, next) => {
  next();
};

exports.validateUpdateComment = (req, res, next) => {
  next();
};
