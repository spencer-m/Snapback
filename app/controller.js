let path = require('path');
let passport = require('passport');
let User = require('./databaseSchema.js');

let accessController = {};

//accessController.isAuthorized();

// Restrict access to root page
accessController.home = function(req, res) {
    if (!req.user)
        res.redirect('/login');
    else
        res.sendFile(path.join(__dirname, '../public/home.html'));
};

// Go to registration page
accessController.register = function(req, res) {
    res.sendFile(path.join(__dirname, '../public/reg.html'));
};

// Post registration
accessController.doRegister = function(req, res) {
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {

        // check if account exists

        if (err) {
            // error thrown when account exists
            return res.sendFile(path.join(__dirname, '../public/error.html'));
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
};

// Go to login page
accessController.login = function(req, res) {
    res.sendFile(path.join(__dirname, '../public/start.html'));
};

// Post login
accessController.doLogin = function(req, res) {
    passport.authenticate('local')(req, res, 
        function () {
            res.redirect('/');
        });
};

// logout
accessController.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

module.exports = accessController;
