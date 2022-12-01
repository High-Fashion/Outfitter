const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  text: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  replies: [
    { type: Schema.Types.ObjectId, ref: "Comment", autopopulate: true },
  ],
  created: { type: Date, default: Date.now },
});

commentSchema.plugin(require("mongoose-autopopulate"));

commentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hashedPassword;
  },
});

module.exports = mongoose.model("Comment", commentSchema);
