const router = require("express").Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 8000000 },
});

const {
  validateCreateItem,
  validateUpdateItem,
} = require("../middleware/wardrobe.middleware");

const item_controller = require("../controllers/item.controller");
const { default: mongoose } = require("mongoose");

router.post(
  "/create",
  upload.single("image"),
  validateCreateItem,
  item_controller.create
);
router.get("/", item_controller.readAll);
router.param("id", (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    next(new Error("Invalid id."));
  } else {
    next();
  }
});
router.get("/:id", item_controller.readOne);
router.put("/:id", validateUpdateItem, item_controller.updateOne);
router.delete("/:id", item_controller.deleteOne);

module.exports = router;
