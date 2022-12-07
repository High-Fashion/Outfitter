const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  imageName: { type: String, required: true },
  type: { type: String, required: true }, //photo, item, outfit
  outfit: { type: Schema.Types.ObjectId, ref: "Outfit", autopopulate: true },
  item: { type: Schema.Types.ObjectId, ref: "Item", autopopulate: true },
  text: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  created: { type: Date, default: Date.now },
  comments: [
    { type: Schema.Types.ObjectId, ref: "Comment", autopopulate: true },
  ],
});

postSchema.plugin(require("mongoose-autopopulate"));

postSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hashedPassword;
  },
});

module.exports = mongoose.model("Post", postSchema);
