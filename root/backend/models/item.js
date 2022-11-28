const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  type: String, //clothing, accessory, shoes
  imageName: String,
  category: String, //jeans, baseball cap, boots.
  subcategories: [String], // jeans => mom, distressed, high waisted
  brand: String,
  colors: {
    primary: String,
    secondary: String,
    tertiary: String,
  },
  pattern: String,
  material: String,
  fit: String, //tight, well, loose
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // delete ret._id;
    // delete ret.hashedPassword;
  },
});

module.exports = mongoose.model("Item", schema);
