const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // delete ret._id;
    // delete ret.hashedPassword;
  },
});

module.exports = mongoose.model("Outfit", schema);
