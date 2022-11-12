const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  outfit: { type: Schema.Types.ObjectId, ref: "Outfit" },
  score: Number,
});

const measurementSchema = new Schema({});

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  acceptTerms: Boolean,
  username: { type: String, unique: true, required: true },
  hashedPassword: { type: String, required: true },
  role: { type: String, required: true, default: "User" },
  created: { type: Date, default: Date.now },
  measurements: [{ type: Schema.Types.ObjectId, ref: "Measurement" }],
  preferences: {
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
  },
  wardrobe: { type: Schema.Types.ObjectId, ref: "Wardrobe", autopopulate: true },
});

userSchema.plugin(require("mongoose-autopopulate"))

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hashedPassword;
  },
});

module.exports = mongoose.model("User", userSchema);
