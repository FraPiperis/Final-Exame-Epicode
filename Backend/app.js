require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const authorsRoute = require('./routes/authors');
const blogPostsRoute = require('./routes/blogPosts.js');

app.use('/authors', authorsRoute);
app.use('/blogPosts', blogPostsRoute);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server in ascolto sulla porta ${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));
