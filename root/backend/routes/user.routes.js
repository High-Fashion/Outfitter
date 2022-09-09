const router = require("express").Router();
const {
  authenticate,
  validateSignUp,
  validateSignIn,
} = require("./middleware/auth.middleware");

const user_controller = require("../controllers/user.controller");

router.post("/signup", validateSignUp, user_controller.signup);
router.post("/signin", validateSignIn, user_controller.signin);

router.use(authenticate);

router.post("/signout", user_controller.signout);
router.get("/", user_controller.readAllRequest);
router.get("/:id", user_controller.readOneRequest);
router.put("/:id", user_controller.updateOneRequest);
router.delete("/:id", user_controller.deleteOneRequest);

module.exports = router;
