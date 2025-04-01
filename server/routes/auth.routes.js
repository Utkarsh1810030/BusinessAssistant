// routes/auth.routes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
    googleCallback,
    logoutUser,
} = require('../controllers/auth.controller');

// @route   GET /auth/google
// @desc    Redirect to Google OAuth
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }),
    (req, res) => {
        const redirectTo = process.env.CLIENT_URL || 'http://localhost:3000';
        res.redirect(`${redirectTo}/dashboard`);
    }
);

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    googleCallback
);

// @route   GET /auth/logout
// @desc    Logout the user
router.get('/logout', logoutUser);

module.exports = router;
