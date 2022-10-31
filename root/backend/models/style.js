const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const styleSchema = new Schema({
  name: { type: String, unique: true, required: true },
});

styleSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Style", styleSchema);
