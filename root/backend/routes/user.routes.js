const router = require("express").Router();
const {
  authenticate,
  validateSignUp,
  validateSignIn,
} = require("../middleware/auth.middleware");

const auth_controller = require("../controllers/auth.controller");
const user_controller = require("../controllers/user.controller");

router.post("/signup", validateSignUp, auth_controller.signup);
router.post("/signin", validateSignIn, auth_controller.signin);

router.use(authenticate);

router.post("/signout", auth_controller.signout);
router.get("/", user_controller.readAllRequest);
router.get("/:id", user_controller.readOneRequest);
router.put("/:id", user_controller.updateOneRequest);
router.delete("/:id", user_controller.deleteOneRequest);

module.exports = router;
