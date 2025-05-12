const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');
const Author = require('../models/Authors.js'); // Assicurati che questo path sia corretto

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // ✅ Usa direttamente l'ambiente
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const author = await Author.findById(jwt_payload.id);
        if (author) {
          return done(null, author);
        }
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};

