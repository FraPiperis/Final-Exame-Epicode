require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
require('./config/passport')(passport);

const authorsRouter = require('./routes/authorsRoute');
const blogPostsRoute = require('./routes/blogPosts');

require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/authors', authorsRouter);
app.use('/blogPosts', blogPostsRoute);

app.get('/', (req, res) => {
  res.send("Server avviato correttamente!");
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server in ascolto su http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("❌ Errore connessione MongoDB:", err));
