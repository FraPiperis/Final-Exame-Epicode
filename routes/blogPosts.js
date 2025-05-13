const express = require("express");
const router = express.Router();
const BlogPost = require("../models/BlogPosts");
const Author = require("../models/Authors");
const sendEmail = require("../mailer/mailer");

// GET /blogPosts - paginazione e filtro titolo
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, title } = req.query;
    const skip = (page - 1) * limit;

    const query = title ? { title: { $regex: title, $options: "i" } } : {};

    const posts = await BlogPost.find(query).skip(Number(skip)).limit(Number(limit));
    const total = await BlogPost.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (err) {
    res.status(500).send("Errore durante il recupero dei post");
  }
});

// GET /blogPosts/:id - singolo post
router.get("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send("Post non trovato");
    res.json(post);
  } catch (err) {
    res.status(400).send("ID non valido");
  }
});

module.exports = router;
