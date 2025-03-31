// controllers/auth.controller.js

// On successful Google OAuth login
const googleCallback = (req, res) => {
    try {
        // You can access user info with req.user
        console.log('User authenticated:', req.user);

        // TODO: Add logic to store user in DB if needed

        // Redirect to dashboard or return a success response
        res.redirect('/dashboard');
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

module.exports = {
    googleCallback,
    logoutUser,
};
