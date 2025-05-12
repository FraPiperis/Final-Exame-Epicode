const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', BlogPostSchema);
