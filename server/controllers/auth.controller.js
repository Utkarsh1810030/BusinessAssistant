// controllers/auth.controller.js

// On successful Google OAuth login
const googleCallback = (req, res) => {
    try {
        // You can access user info with req.user
        console.log('User authenticated:', req.user);

        const redirectTo = process.env.CLIENT_URL || 'http://localhost:5173';
        console.log('✅ Redirecting to:', `${redirectTo}/dashboard`);
        res.redirect(`${redirectTo}/`);
    } catch (error) {
        console.error('Google callback error:', error);
        res.status(500).send('Authentication failed.');
    }
};

// Logout the user
const logoutUser = (req, res, next) => {
    req.logout(err => {
        if (err) {
            console.error('Logout error:', err);
            return next(err);
        }
        req.session.destroy(() => {
            res.clearCookie('connect.sid'); // optional: clear session cookie
            res.redirect('/');
        });
    });
};

// GET /auth/me
const getCurrentUser = (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json(null);
    }
};

module.exports = {
    googleCallback,
    logoutUser,
    getCurrentUser
};
