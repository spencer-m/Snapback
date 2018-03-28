let path = require('path');
let express = require('express');
let router = express.Router();
let passport = require('passport');
let User = require('./userdb.js');

router.get('/', function(req, res) {

    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, '../public/home.html'));
    }
    else {
        res.redirect('/login');
    }
});

router.get('/register', function(req, res) {
    
    res.render('register', {
        success: req.flash('success'),
        error: req.flash('error')
    });
});

router.post('/register', function(req, res) {

    // check if the email already exists
    User.findOne({'email': new RegExp('^' + req.body.email + '$', 'i')}, function(err, user) {
        
        if (err) throw err;
        if (user) {
            req.flash('error', 'Sorry, email already exists.');
            res.redirect('/register');
        }
        // create user
        else {
            User.register(new User({ email : req.body.email }), req.body.password, function(err, user) {
                    
                if (err) throw err;  
                req.flash('success', 'Your account has been created! Please log in.');
                res.redirect('/');
            });
        }
    });
});

router.get('/login', function(req, res) {

    if (!req.isAuthenticated()) {
        res.render('start', {
            success: req.flash('success'),
            error: req.flash('error')
        });
    }
    else {
        res.sendFile(path.join(__dirname, '../public/home.html'));
    }
});

// Login
router.post('/login', passport.authenticate('local', { 
    successRedirect: '/', 
    failureRedirect: '/',
    failureFlash: 'Email or password is incorrect'
}));

// Logout
router.get('/logout', function(req, res) {
    // remove the req.user property and clear the login session
    req.logout();
    // delete session data
    req.session.destroy();
    // redirect to homepage
    res.redirect('/');
});

module.exports = router;
