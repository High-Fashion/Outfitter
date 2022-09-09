const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const source = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

const userRouter = require("./routes/user.routes");

// MongoDB
mongoose.connect(source);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("DB connected.");
});

const app = express();

app.use(cors());

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routing
app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Successfully served on port: ${PORT}.`);
});
