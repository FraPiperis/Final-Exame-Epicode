const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const BlogPost = require('../models/BlogPost');

router.get('/', async (req, res) => {
  const posts = await BlogPost.find().populate('author');
  res.send(posts);
});

router.post('/', auth, async (req, res) => {
  const post = new BlogPost({ ...req.body, author: req.user.id });
  await post.save();
  res.status(201).send(post);
});

router.delete('/:id', auth, async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id);
  res.send({ message: 'Eliminato' });
});

module.exports = router;
