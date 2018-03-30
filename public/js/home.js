

/**
 * When web app is loaded
 */
$(document).ready(function() {

    let socket = io();

    socket.on('init', function(info) {
        console.log(info);
        $('#name').text(info.email);
    });
});
