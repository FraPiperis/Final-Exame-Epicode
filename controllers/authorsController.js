const Author = require('../models/Author');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const author = new Author(req.body);
    await author.save();
    res.status(201).send(author);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const author = await Author.findOne({ email });
  if (!author || !await bcrypt.compare(password, author.password))
    return res.status(401).send('Credenziali non valide');
  
  const token = jwt.sign({ id: author._id }, process.env.JWT_SECRET);
  res.send({ token });
};

exports.getMe = async (req, res) => {
  const author = await Author.findById(req.user.id);
  res.send(author);
};
