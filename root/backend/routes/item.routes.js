const router = require("express").Router();

const {
  validateCreateItem,
  validateUpdateItem,
} = require("../middleware/wardrobe.middleware");

const item_controller = require("../controllers/item.controller");
const image_controller = require("../controllers/image.controller")

// functions(options) are called in order of options

// router.post("/create", item_controller.uploadImage, next);
router.post("/create", validateCreateItem, item_controller.create, image_controller.uploadImage);
// router.post("/create", validateCreateItem, item_controller.testMiddleware, item_controller.testTwo)
router.get("/", item_controller.readAll);
router.get("/:id", item_controller.readOne);
router.put("/:id", validateUpdateItem, item_controller.updateOne);
router.delete("/:id", item_controller.deleteOne);

module.exports = router;
