const router = require("express").Router();

const {
  validateCreatePost,
  validateUpdatePost,
} = require("../middleware/post.middleware");

const post_controller = require("../controllers/post.controller");

router.post("/create", validateCreatePost, post_controller.create);
router.get("/", post_controller.readAll);
router.get("/:id", post_controller.readOne);
router.put("/:id", validateUpdatePost, post_controller.updateOne);
router.delete("/:id", post_controller.deleteOne);
//comments
router.post("/comment", validateCreatePost, post_controller.comment);
router.put("/comment/:id", validateUpdatePost, post_controller.updateComment);
router.delete("/comment/:id", post_controller.deleteComment);

module.exports = router;
