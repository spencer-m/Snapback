let userdb = require('./userdb.js');

let io = {};

io.connection = function(socket) {
        
    
    console.log(':::socketio::: user: ', socket.request.user);
    console.log(userdb.find({username: socket.request.user.username}));
    /*
    if (socket.request.user && socket.request.user.logged_in) {
        console.log(socket.request.user);
    }
    */
    let info = {username: socket.request.user.username, isLoggedIn: socket.request.user.logged_in};
    socket.emit('init', info);
};

module.exports = io;