require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');

const app = express();
app.use(cors());
app.use(express.json());


// Endpoint di esempio
app.get("/", (req, res) => {
  res.send("Server avviato correttamente!");
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});

import authorsRouter from './routes/authorsRoute.js';
app.use('/authors', authorsRouter);
app.use('/blogPosts', blogPostsRoute);
const blogPostsRoute = require('./routes/blogPosts.js');

app.use(passport.initialize());
import authorsRouter from './routes/authorsRoute.js';






mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server in ascolto sulla porta ${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));
