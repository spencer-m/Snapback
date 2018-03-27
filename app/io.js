let io = {};

io.connection = function(socket) {
        
    console.log(':::socketio::: user: ', socket.request.user);
    if (socket.request.user && socket.request.user.logged_in) {
        console.log(socket.request.user);
    }
};

module.exports = io;