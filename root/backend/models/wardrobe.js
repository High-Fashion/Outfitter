const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const styleSchema = new Schema({});

const wardrobeSchema = new Schema({
  gender: [String],
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  accessories: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  styles: [{ type: Schema.Types.ObjectId, ref: "Style" }],
  user: { type: Schema.Types.ObjectId, ref: "User" },
  outfits: [{ type: Schema.Types.ObjectId, ref: "Outfit" }],
});

wardrobeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hashedPassword;
  },
});

module.exports = mongoose.model("Wardrobe", wardrobeSchema);
