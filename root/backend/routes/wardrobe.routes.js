const router = require("express").Router();

const { authorize } = require("../middleware/auth.middleware");
const {
  validateCreateWardrobe,
  validateUpdateWardrobe,
} = require("../middleware/wardrobe.middleware");

const wardrobe_controller = require("../controllers/wardrobe.contoller");

router.use(authorize);

router.post("/create", validateCreateWardrobe, wardrobe_controller.create);
router.get("/", wardrobe_controller.readAll);
router.get("/:id", wardrobe_controller.readOne);
router.put("/:id", validateUpdateWardrobe, wardrobe_controller.updateOne);
router.delete("/:id", wardrobe_controller.deleteOne);

module.exports = router;
