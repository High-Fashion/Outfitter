const router = require("express").Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  validateCreateOutfit,
  validateUpdateOutfit,
} = require("../middleware/wardrobe.middleware");

const outfit_controller = require("../controllers/outfit.controller");

router.post(
  "/create",
  upload.single("image"),
  validateCreateOutfit,
  outfit_controller.create
);
router.get("/", outfit_controller.readAll);
router.get("/:id", outfit_controller.readOne);
router.get("/:id/similar", outfit_controller.generateSimilarOutfits);
router.get("/:id/copy", outfit_controller.copy);
router.put("/:id", validateUpdateOutfit, outfit_controller.updateOne);
router.delete("/:id", outfit_controller.deleteOne);

module.exports = router;
