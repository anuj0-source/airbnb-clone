function isAuth(req, res, next) {
    if (!req.session || !req.session.isLoggedIn) {

        // For AJAX/fetch requests, return 401 JSON instead of redirect
        if (req.headers['content-type'] === 'application/json' || req.xhr) {
            return res.status(401).json({ message: 'Please log in first', redirect: '/login' });
        }
        
        return res.redirect("/login");
    }
    next();
}

module.exports=isAuth;