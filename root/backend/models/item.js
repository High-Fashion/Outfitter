const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String, required: true }, //clothing, accessory, shoes
  imageName: { type: String, required: false },
  category: { type: String, required: true }, //jeans, baseball cap, boots.
  subcategories: [{ type: String, required: true }], // jeans => mom, distressed, high waisted
  brand: { type: String, required: true },
  colors: {
    primary: String,
    secondary: String,
    tertiary: String,
  },
  pattern: { type: String, required: true },
  material: { type: String, required: true },
  fit: { type: String, required: false }, //tight, well, loose
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
