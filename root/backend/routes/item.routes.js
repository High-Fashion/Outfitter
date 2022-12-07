const router = require("express").Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1048576 }
 });

const {
  validateCreateItem,
  validateUpdateItem,
} = require("../middleware/wardrobe.middleware");

const item_controller = require("../controllers/item.controller");

router.post(
  "/create",
  upload.single("image"),
  validateCreateItem,
  item_controller.create
);
router.get("/", item_controller.readAll);
router.get("/:id", item_controller.readOne);
router.put("/:id", validateUpdateItem, item_controller.updateOne);
router.delete("/:id", item_controller.deleteOne);

module.exports = router;
