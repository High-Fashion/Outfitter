const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  outfit: { type: Schema.Types.ObjectId, ref: "Outfit" },
  score: Number,
});

ratingSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Rating", ratingSchema);
