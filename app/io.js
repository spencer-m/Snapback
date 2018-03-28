let userdb = require('./userdb.js');

let io = {};

io.connection = function(socket) {
        
    
    /* connection initialiation */

    console.log(':::socketio::: user: ', socket.request.user);
    /*
    if (socket.request.user && socket.request.user.logged_in) {
        console.log(socket.request.user);
    userModel.findByUsername(email).then(function(sanitizedUser){
    if (sanitizedUser){
        sanitizedUser.setPassword(newPasswordString, function(){
            sanitizedUser.save();
            res.status(200).json({message: 'password reset successful'});
        });
    } else {
        res.status(500).json({message: 'This user does not exist'});
    }
    },function(err){
        console.error(err);
    })
    }
    https://stackoverflow.com/questions/17828663/passport-local-mongoose-change-password
    */
    userdb.findOne({email: socket.request.user.email}, function(err, doc) {

        if (err) {
            console.log('error occured', err);
        }
        else {
            console.log('the document', doc);
        }
    });

    let info = {email: socket.request.user.email, isLoggedIn: socket.request.user.logged_in};
    socket.emit('init', info);
};

module.exports = io;