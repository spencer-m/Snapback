let userdb = require('./userdb.js');

let io = {};

io.connection = function(socket) {
        
    
    console.log(':::socketio::: user: ', socket.request.user);
    /*
    if (socket.request.user && socket.request.user.logged_in) {
        console.log(socket.request.user);
    }
    */
    userdb.findOne({username: socket.request.user.username}, function(err, doc) {

        if (err) {
            console.log('error occured', err);
        }
        else {
            console.log('the document', doc);
        }
    });
    let info = {username: socket.request.user.username, isLoggedIn: socket.request.user.logged_in};
    socket.emit('init', info);
};

module.exports = io;