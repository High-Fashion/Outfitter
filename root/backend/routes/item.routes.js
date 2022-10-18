const router = require("express").Router();

const {
  validateCreateItem,
  validateUpdateItem,
} = require("../middleware/wardrobe.middleware");

const item_controller = require("../controllers/item.controller");

router.post("/create", validateCreateItem, item_controller.create);
router.get("/", item_controller.readAll);
router.get("/:id", item_controller.readOne);
router.put("/:id", validateUpdateItem, item_controller.updateOne);
router.delete("/:id", item_controller.deleteOne);

module.exports = router;
