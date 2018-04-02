// server side socketio

let userdb = require('./userdb.js');

let io = {};

io.connection = function(socket) {
        
    
    /* connection initialiation */

    console.log(':::socketio::: user: ', socket.request.user);

    userdb.findOne({email: socket.request.user.email}, function(err, user) {

        if (err) {
            console.log('error occured', err);
        }
        else {
            console.log('the document', user);
        }
    });

    let info = {email: socket.request.user.email, isLoggedIn: socket.request.user.logged_in};
    socket.emit('init', info);
};

module.exports = io;