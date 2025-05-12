require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');

// Importa rotte
const authorsRouter = require('./routes/authorsRoute');
const blogPostsRoute = require('./routes/blogPosts');

// Passport config
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Rotte
app.use('/authors', authorsRouter);
app.use('/blogPosts', blogPostsRoute);

// Endpoint di test
app.get("/", (req, res) => {
  res.send("Server avviato correttamente!");
});

// Connessione al DB e avvio server
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server avviato su http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("Errore connessione MongoDB:", err));
