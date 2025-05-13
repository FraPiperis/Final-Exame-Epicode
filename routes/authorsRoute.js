// routes/authorsRoute.js

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthorModel from '../models/authorModel.js';
import { JWT_SECRET } from '../config.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// REGISTRAZIONE
router.post('/', async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;

        const existingUser = await AuthorModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email già registrata.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAuthor = new AuthorModel({ name, surname, email, password: hashedPassword });
        await newAuthor.save();

        res.status(201).json(newAuthor);
    } catch (error) {
        res.status(500).json({ message: 'Errore nella registrazione', error });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await AuthorModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Errore nel login', error });
    }
});

// DATI UTENTE LOGGATO
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await AuthorModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero dell’utente', error });
    }
});

export default router;
