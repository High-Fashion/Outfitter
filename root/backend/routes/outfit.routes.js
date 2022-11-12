const router = require("express").Router();

const {
  validateCreateOutfit,
  validateUpdateOutfit,
} = require("../middleware/wardrobe.middleware");

const outfit_controller = require("../controllers/outfit.controller");

router.post("/create", validateCreateOutfit, outfit_controller.create);
router.get("/", outfit_controller.readAll);
router.get("/:id", outfit_controller.readOne);
router.put("/:id", validateUpdateOutfit, outfit_controller.updateOne);
router.delete("/:id", outfit_controller.deleteOne);

module.exports = router;
