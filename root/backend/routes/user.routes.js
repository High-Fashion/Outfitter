const router = require("express").Router();

const user_controller = require("../controllers/user.controller");

router.get("/", user_controller.readAll);
router.param("id", (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    next(new Error("Invalid id."));
  } else {
    next();
  }
});
router.get("/:id", user_controller.readOne);
router.put("/:id", user_controller.updateOne);
router.delete("/:id", user_controller.deleteOne);
router.post("/follow/:id", user_controller.follow);

module.exports = router;
