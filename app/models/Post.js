const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  authors: {
    type: Array,
    required: true
  },
  doi: {
      type: String,
      required: true
  },
  date: {
      type: String,
      required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
