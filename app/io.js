let io = {};

io.connection = function(socket) {

    socket.emit('flashStatusMessage', 'Incorrect login', 4000);
};

module.exports = io;