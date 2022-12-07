const router = require("express").Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 1048576 } });

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
router.param("id", (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    next(new Error("Invalid id."));
  } else {
    next();
  }
});
router.get("/:id", outfit_controller.readOne);
router.get("/:id/similar", outfit_controller.generateSimilarOutfits);
router.get("/:id/copy", outfit_controller.copy);
router.put("/:id", validateUpdateOutfit, outfit_controller.updateOne);
router.delete("/:id", outfit_controller.deleteOne);

module.exports = router;
