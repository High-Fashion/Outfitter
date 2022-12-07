const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  name: String,
  imageName: String,
  styles: [String],
  user: { type: Schema.Types.ObjectId, ref: "User" },
  hair: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
  head: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
  eyes: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
  nose: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
  ear: {
    left: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
    right: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
  },
  mouth: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
  neck: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
  torso: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
  back: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
  left: {
    upper_arm: [
      { type: Schema.Types.ObjectId, ref: "Item", autopopulate: true },
    ],
    forearm: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
    wrist: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
    hand: {
      thumb: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
      index: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
      middle: [
        { type: Schema.Types.ObjectId, ref: "Item", autopopulate: true },
      ],
      ring: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
      pinky: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
    },
    thigh: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
    ankle: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
  },
  right: {
    upper_arm: [
      { type: Schema.Types.ObjectId, ref: "Item", autopopulate: true },
    ],
    forearm: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
    wrist: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
    hand: {
      thumb: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
      index: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
      middle: [
        { type: Schema.Types.ObjectId, ref: "Item", autopopulate: true },
      ],
      ring: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
      pinky: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
    },
    thigh: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
    ankle: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
  },
  legs: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
  waist: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
  hips: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
  feet: [{ type: Schema.Types.ObjectId, ref: "Item", autopopulate: true }],
});

schema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Outfit", schema);
