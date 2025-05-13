require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');

// Configura Passport
require('./config/passport')(passport);

// Importa correttamente le rotte
const authorsRouter = require('./routes/authorsRoute');
const blogPostsRouter = require('./routes/blogPosts'); // Assicurati che il file sia "blogPostsRoute.js"

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Usa le rotte
app.use('/authors', authorsRouter);
app.use('/blogPosts', blogPostsRouter);

// Rotta di test
app.get('/', (req, res) => {
  res.send("✅ Server avviato correttamente!");
});

// Connessione al DB e avvio del server
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server in ascolto su http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("❌ Errore connessione MongoDB:", err));
