// app
let express = require('express');
// path middleware
let path = require('path');
// HTTP request logger middleware for formatting
let logger = require('morgan');
// middleware for parsing cookies
let cookieParser = require('cookie-parser');
// parse incoming bodies in a middleware before your handlers
let bodyParser = require('body-parser');
// use flash middleware
let flash = require('connect-flash');
// authentication middleware
let passport = require('passport');
// middleware for authenticating with a username (were using email) and password
let LocalStrategy = require('passport-local').Strategy;
// a tool for MongoDB for object modelling
let mongoose = require('mongoose');
// session
let session = require('express-session');
// session store
let sessionStore = require('connect-mongo')(session);
// passport.js + socket.io
let passportSocketIo = require('passport.socketio');
// import web app routing
let router = require('./routes.js');
// get app
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let ioFunctions = require('./io.js');
// ES6 Promises - Promises represents the eventual completion or failure
// of an asynchronous operation and its resulting value
mongoose.Promise = global.Promise;
// connect to the database
mongoose.connect('mongodb://forappconnect:qwerty123@ds263988.mlab.com:63988/snapback2018')
    .then(() =>  console.log('connection to database successful!'))
    .catch((err) => console.error(err));
let sessionStoreInstance = new sessionStore({mongooseConnection: mongoose.connection});
// make the app stack
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// connect-flash
app.use(flash());
// use express-session
app.use(session({
    store: sessionStoreInstance,
    secret: 'seng513 snapback',
    resave: false,
    unset: 'destroy',
    saveUninitialized: false
}));
io.use(passportSocketIo.authorize({
    store: sessionStoreInstance,
    secret: 'seng513 snapback'
}));
app.use(passport.initialize());
app.use(passport.session());
// setup passport
let db = require('./userdb.js');
passport.use(new LocalStrategy({usernameField: 'email'}, db.authenticate()));
passport.serializeUser(db.serializeUser());
passport.deserializeUser(db.deserializeUser());
// set homepage
app.use('/', router);
// serve static files
app.use(express.static(path.join(__dirname, '../public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.sendFile(path.join(__dirname, '../public/error.html'));
});

io.on('connection', ioFunctions.connection);
app.set('appserver', http);
app.set('views', path.join(__dirname, '../public'));
app.set('view engine', 'ejs');

module.exports = app;
