const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  profilePicture: { type: String },
  isVerified: { type: Boolean, default: false },
},
{versionKey:false}
);

const User = mongoose.model('user', userSchema);
module.exports = User
 