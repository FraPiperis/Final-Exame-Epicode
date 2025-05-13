const express = require("express");
const router = express.Router();
const Author = require("../models/Authors");

// GET /authors - tutti gli autori
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (err) {
    res.status(500).send("Errore del server");
  }
});

// GET /authors/:id - autore specifico
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).send("Autore non trovato");
    res.json(author);
  } catch {
    res.status(400).send("ID non valido");
  }
});

// POST /authors - nuovo autore
router.post("/", async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    const saved = await newAuthor.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).send("Errore nella creazione dell'autore");
  }
});

// PUT /authors/:id - modifica autore
router.put("/:id", async (req, res) => {
  try {
    const updated = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).send("Autore non trovato");
    res.json(updated);
  } catch {
    res.status(400).send("Errore durante l'aggiornamento");
  }
});

// DELETE /authors/:id - elimina autore
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Author.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Autore non trovato");
    res.send("Autore eliminato");
  } catch {
    res.status(400).send("Errore durante l'eliminazione");
  }
});

module.exports = router;


