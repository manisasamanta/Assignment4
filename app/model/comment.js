const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
});

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment