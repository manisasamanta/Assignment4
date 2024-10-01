const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  tags: [String],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  likes: { type: Number, default: 0 },
});

const Post = mongoose.model('post', postSchema);
module.exports = Post
