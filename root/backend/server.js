const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const source = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

const userRouter = require("./routes/user.routes");
const wardrobeRouter = require("./routes/wardrobe.routes");
const itemRouter = require("./routes/item.routes");

// MongoDB
mongoose.connect(source);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("DB connected.");
});

const app = express();

app.use(cors());

app.use(cookieParser());

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routing
app.use("/users", userRouter);
app.use("/wardrobe", wardrobeRouter);
app.use("/item", itemRouter);

app.listen(PORT, () => {
  console.log(`Successfully served on port: ${PORT}.`);
});
