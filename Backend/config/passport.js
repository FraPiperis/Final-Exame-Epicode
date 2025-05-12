const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Author = require('../models/Authors.js');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  let user = await Author.findOne({ googleId: profile.id });
  if (!user) {
    user = await Author.create({ googleId: profile.id, name: profile.displayName });
  }
  done(null, user);
}));
