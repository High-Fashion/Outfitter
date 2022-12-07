const router = require("express").Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  validateCreatePost,
  validateUpdatePost,
} = require("../middleware/post.middleware");

const post_controller = require("../controllers/post.controller");

router.post(
  "/create",
  upload.single("image"),
  validateCreatePost,
  post_controller.create
);
router.get("/follow", post_controller.readAllFollowing);
router.get("/", post_controller.readAll);
router.param("id", (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    next(new Error("Invalid id."));
  } else {
    next();
  }
});
router.get("/:id", post_controller.readOne);
router.put("/:id", validateUpdatePost, post_controller.updateOne);
router.delete("/:id", post_controller.deleteOne);
//comments
router.post("/comment", validateCreatePost, post_controller.comment);
router.put("/comment/:id", validateUpdatePost, post_controller.updateComment);
router.delete("/comment/:id", post_controller.deleteComment);

module.exports = router;
