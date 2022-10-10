const router = require("express").Router();
const {
  authorize,
  validateSignUp,
  validateSignIn,
} = require("../middleware/auth.middleware");

const auth_controller = require("../controllers/auth.controller");
const user_controller = require("../controllers/user.controller");

router.post("/signup", validateSignUp, auth_controller.signup);
router.post("/signin", validateSignIn, auth_controller.signin);
router.post("/refresh", auth_controller.refresh);

router.use(authorize);

router.post("/signout", auth_controller.signout);
router.get("/", user_controller.readAll);
router.get("/:id", user_controller.readOne);
router.put("/:id", user_controller.updateOne);
router.delete("/:id", user_controller.deleteOne);

module.exports = router;
