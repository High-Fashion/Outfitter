const router = require("express").Router();

const user_controller = require("../controllers/user.controller");

router.get("/", user_controller.readAll);
router.get("/:id", user_controller.readOne);
router.put("/:id", user_controller.updateOne);
router.delete("/:id", user_controller.deleteOne);

module.exports = router;
