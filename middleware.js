const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Vous devez être connecté');
        return res.redirect('/login');
    }
    next();
};

module.exports = isLoggedIn;