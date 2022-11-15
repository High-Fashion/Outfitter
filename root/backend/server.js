const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const source = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

const auth_controller = require("./controllers/auth.controller");
const {
  authorize,
  validateSignUp,
  validateSignIn,
} = require("./middleware/auth.middleware");

const userRouter = require("./routes/user.routes");
const user_controller = require("./controllers/user.controller");
const wardrobeRouter = require("./routes/wardrobe.routes");
const itemRouter = require("./routes/item.routes");
const outfitRouter = require("./routes/outfit.routes");
const postRouter = require("./routes/post.routes");

// MongoDB
mongoose.connect(source);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("DB connected.");
});

const app = express();

app.use(cors({ origin: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", (req, res, next) => {
  console.log(req.body);
  next();
});

//Routing
app.post("/signup", validateSignUp, auth_controller.signup);
app.post("/signin", validateSignIn, auth_controller.signin);
app.post("/refresh", auth_controller.refresh);
app.use(authorize);
app.get("/user", user_controller.get);
app.post("/signout", auth_controller.signout);

app.use("/users", userRouter);
app.use("/wardrobe", wardrobeRouter);
app.use("/item", itemRouter);
app.use("/outfit", outfitRouter);
app.use("/post", postRouter);

app.listen(PORT, () => {
  console.log(`Successfully served on port: ${PORT}.`);
});
