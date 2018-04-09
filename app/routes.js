let path = require('path');
let express = require('express');
let router = express.Router();
let passport = require('passport');
let User = require('./userdb.js');
let Util = require('./utildb.js');

/**
 * Invalidate HTML tags.
 * Source:
 * https://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
 * @param {String} string 
 */
var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

/**
 * Checks if string is unescaped.
 * @param {String} string 
 */
function isEscapedHtml (string) {
    let string2 = escapeHtml(string);
    return (string2 === string);
}

//https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/* registration values initalize */

let universities = [];

Util.University.find({}, function(err, uni) {
    for (let u of uni) {
        universities.push(u.name);
    }
});

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
        error: req.flash('error'),
        uni: universities
    });
});

router.post('/register', function(req, res) {

    // form validation

    // only detection, not sanitation
    for (let x in req.body) {
        if (x === 'password' || x === 'confirm_password' || isEscapedHtml(req.body[x]))
            continue;
        else {
            req.flash('error', 'Invalid characters detected.');
            return res.redirect('/register');
        }
    }

    // validate email address
    if (!validateEmail(req.body.email)) {
        req.flash('error', 'Invalid email address.');
        return res.redirect('/register');
    }

    // check if email is typed correctly
    if (req.body.email !== req.body.confirm_email) {
        req.flash('error', 'Emails do not match.');
        return res.redirect('/register');
    }

    // check if password is typed correctly
    if (req.body.password !== req.body.confirm_password) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect('/register');
    }

    // check if the email already exists
    User.findOne({email: new RegExp('^' + req.body.email + '$', 'i')}, function(err, user) {
        if (err) throw err;
        // error when email exists
        if (user) {
            req.flash('error', 'Sorry, email already exists.');
            res.redirect('/register');
        }
        // next step: get objectID of university
        else {
            Util.University.findOne({name: req.body.university}, function(err, uni) {  
                if (err) throw err;
        
                if (uni) {
                    // next step: check if the id already taken in unversity
                    User.findOne({id: req.body.id, university: uni._id}, function(err, id) {
                        if (err) throw err;
                        // error when id exists
                        if (id) {
                            req.flash('error', 'Sorry, ID already exists.');
                            res.redirect('/register');
                        }
                        else {
                            // check regkey and register
                            if (req.body.prof === 'Professor') {
                                Util.Key.findOne({key: req.body.regkey, isUsed: false}, function(err, key) {
                                    if (err) throw err;
                                    // if key exists
                                    if (key) {
                                        // create user
                                        let newUser = new User({
                                            email: req.body.email,
                                            name: {first: req.body.fname, last: req.body.lname},
                                            id: req.body.id,
                                            university: uni._id,
                                            isProfessor: true
                                        });
                                        User.register(newUser, req.body.password, function(err, user) {
                                            if (err) throw err;  
                                            req.flash('success', 'Your account has been created! Please log in.');
                                            res.redirect('/');
                                        });
                                        // update key to be used
                                        key.isUsed = true;
                                        key.save();
                                    }
                                    // if key does not exists
                                    else {
                                        req.flash('error', 'Sorry, invalid registration key.');
                                        res.redirect('/register');
                                    }
                                });
                            }
                            // proceed with account creation
                            else if (req.body.prof === 'Student') {
                                // create user
                                let newUser = new User({
                                    email: req.body.email,
                                    name: {first: req.body.fname, last: req.body.lname},
                                    id: req.body.id,
                                    university: uni._id,
                                    isProfessor: false
                                });
                                User.register(newUser, req.body.password, function(err, user) {
                                    if (err) throw err;  
                                    req.flash('success', 'Your account has been created! Please log in.');
                                    res.redirect('/');
                                });
                            }
                            // catch all statement
                            else {
                                req.flash('error', 'Sorry, type does not exists.');
                                res.redirect('/register');
                            }
                        }
                    });
                }
                // error when university does not exists
                else {
                    req.flash('error', 'Sorry, university does not exist.');
                    res.redirect('/register');
                }
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
        res.redirect('/');
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

// TODO: perserve form data on error
// TODO: deal with checkbox