const express = require("express");
const router = express.Router();
const BlogPost = require("../models/BlogPost.js");
const Author = require("../models/Authors.js"); // per trovare l'autore
const sendEmail = require("../mailer");     // funzione di invio mail


// GET /blogPosts - con paginazione
// GET /blogPosts - con paginazione e filtro titolo
router.get("/", async (req, res) => {
    const { page = 1, limit = 10, title } = req.query;
    const skip = (page - 1) * limit;
  
    const query = {};
    if (title) {
      query.title = { $regex: title, $options: "i" }; // case-insensitive
    }
  
    const posts = await BlogPost.find(query)
      .skip(Number(skip))
      .limit(Number(limit));
  
    const total = await BlogPost.countDocuments(query);
  
    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      data: posts
    });
  });
  

// GET /blogPosts/:id - singolo post
router.get("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send("Post non trovato");
    res.json(post);
  } catch {
    res.status(400).send("ID non valido");
  }
});

// POST /blogPosts - nuovo post
router.post("/", async (req, res) => {
  try {
    const newPost = new BlogPost(req.body);
    const savedPost = await newPost.save();

    // Trova l'autore tramite la sua email
    const author = await Author.findOne({ email: savedPost.author });
    if (author) {
      await sendEmail({
        to: author.email,
        subject: "Hai pubblicato un nuovo blog post!",
        html: `
          <h2>Ciao ${author.nome},</h2>
          <p>Il tuo post <strong>"${savedPost.title}"</strong> è stato pubblicato con successo!</p>
        `
      });
    }

    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(400).send("Errore nella creazione del post");
  }
});


// PUT /blogPosts/:id - aggiorna post
router.put("/:id", async (req, res) => {
  try {
    const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).send("Post non trovato");
    res.json(updated);
  } catch {
    res.status(400).send("Errore durante l'aggiornamento");
  }
});

// DELETE /blogPosts/:id - cancella post
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Post non trovato");
    res.send("Post eliminato");
  } catch {
    res.status(400).send("Errore durante l'eliminazione");
  }
});

// GET /authors/:id/blogPosts - tutti i post per autore (via ID)
// filepath: routes/BlogPost.js
/*...*/
router.get("/authors/:id/blogPosts", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).send("Autore non trovato");

    const posts = await BlogPost.find({ author: author.email });
    res.json(posts);
  } catch {
    res.status(400).send("Errore");
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send("Post non trovato");
    res.json(post.comments);
  } catch (err) {
    res.status(500).send("Errore del server");
  }
});


// GET /blogPosts/:id/comments/:commentId - commento specifico
router.get("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send("Post non trovato");

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).send("Commento non trovato");

    res.json(comment);
  } catch (err) {
    res.status(500).send("Errore del server");
  }
});

// POST /blogPosts/:id - aggiungi commento
router.post("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send("Post non trovato");

    const newComment = {
      author: req.body.author,
      content: req.body.content,
    };

    post.comments.push(newComment);
    await post.save();
    res.status(201).json(post.comments);
  } catch (err) {
    res.status(500).send("Errore del server");
  }
});

// PUT /blogPosts/:id/comment/:commentId - modifica commento
router.put("/:id/comment/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send("Post non trovato");

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).send("Commento non trovato");

    comment.author = req.body.author || comment.author;
    comment.content = req.body.content || comment.content;
    await post.save();

    res.json(comment);
  } catch (err) {
    res.status(500).send("Errore del server");
  }
});

// DELETE /blogPosts/:id/comment/:commentId - elimina commento
router.delete("/:id/comment/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send("Post non trovato");

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).send("Commento non trovato");

    comment.remove();
    await post.save();

    res.send("Commento eliminato");
  } catch (err) {
    res.status(500).send("Errore del server");
  }
}
module.exports = router; 