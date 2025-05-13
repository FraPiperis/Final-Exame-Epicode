const express = require('express');
const router = express.Router();

// Rotte qui
router.get('/', (req, res) => res.send("Tutti i blog posts"));

module.exports = router;
