const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AuthorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  googleId: String,
});

AuthorSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

module.exports = mongoose.model('Author', AuthorSchema);
