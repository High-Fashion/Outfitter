const router = require("express").Router();
const mongoose = require("mongoose");

const {
  validateCreateWardrobe,
  validateUpdateWardrobe,
} = require("../middleware/wardrobe.middleware");

const wardrobe_controller = require("../controllers/wardrobe.contoller");

router.post("/create", validateCreateWardrobe, wardrobe_controller.create);
router.get("/", wardrobe_controller.readAll);
router.param("id", (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    next(new Error("Invalid id."));
  } else {
    next();
  }
});
router.get("/:id", wardrobe_controller.readOne);
router.put("/:id", validateUpdateWardrobe, wardrobe_controller.updateOne);
router.delete("/:id", wardrobe_controller.deleteOne);

module.exports = router;
