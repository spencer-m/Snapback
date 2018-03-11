

/**
 * When web app is loaded
 */
$(document).ready(function() {

    let socket = io();

    // flash a status message when a flashStatusMessage signal is received
    socket.on('flashStatusMessage', function(statmsg, dTime) {
        $('#statusmessage').text(statmsg).fadeIn(1).delay(dTime).fadeOut();
    });
});