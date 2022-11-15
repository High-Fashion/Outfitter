const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  outfit: { type: Schema.Types.ObjectId, ref: "Outfit" },
  score: Number,
});

ratingSchema.plugin(require("mongoose-autopopulate"));

ratingSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hashedPassword;
  },
});

module.exports = mongoose.model("Rating", ratingSchema);
