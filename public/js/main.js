/**
 * SENG 513 Assignment 3
 * Spencer Manzon
 * 10129731
 * 
 */

/**
 * Clears and reloads the chatlog
 * @param {Array} chatlog 
 */
function loadChatlog(chatlog) {

    $('#messages').empty();

    // get cookie value by making cookie into object
    let cookies = document.cookie.split('; ');
    let cookieObj = {};
    for (let c of cookies) {
        let keyval = c.split('=', 2);
        cookieObj[keyval[0]] = keyval[1];
    }

    let clientNick = cookieObj.nick;

    for (let c of chatlog) {

        let msgfmt = formatMessageObj(c, clientNick);
        $('#messages').append($('<div class="list-group-item">').html(msgfmt));
    }

    $('#messages').scrollTop($('#messages')[0].scrollHeight);
}

/**
 * Processes the message object using the nickname as a basis of formatting
 * @param {Object} msgobj 
 * @param {String} nick 
 */
function formatMessageObj(msgobj, nick) {

    // default error message
    let msgfmt = '<b><i>(' + msgobj.timestamp + ') Fatal Error: Invalid Message Type!</i></b>';

    // two types supported: chatmsg and actionmsg
    if (msgobj.type === 'chatmsg') {
        // get message
        let message = msgobj.message;
        // check if message is owned by client
        if (msgobj.nick === nick)
            // if true, bold message
            message = '<b>' + msgobj.message + '</b>';
        // add color to nickname
        let nickcolored = '<span style="color: #' + msgobj.nickcolor + '">'+ msgobj.nick + '</span>';
        // combine elements to form formatted message
        msgfmt = '(' + msgobj.timestamp + ') ' + nickcolored + ': ' +  message;
    }
    else if (msgobj.type === 'actionmsg')
        // italicize whole message
        msgfmt = '<i> (' + msgobj.timestamp + ')' + ': ' +  msgobj.message + '</i>';

    return msgfmt;
}

/**
 * Clears and reloads the userlist
 * @param {Object} users 
 */
function loadUserlist(users) {

    $('#userlist').empty();
    for (let s in users) {
        let nick = users[s].nick;
        // add color to nickname
        let nickcolored = '<span style="color: #' + users[s].nickcolor + '">'+ nick + '</span>';
        let li = '<li class="list-group-item" id="' + nick + '">' + nickcolored + '</li>';
        $('#userlist').append(li);
    }
}

/**
 * When web app is loaded
 */
$(document).ready(function() {

    var socket = io();

    // set the input box as focus upon load
    $('#inputbox').focus();

    // load chatlog when a chatRefresh signal is received
    socket.on('chatRefresh', loadChatlog);

    // update nickname header when an updateNickHeader signal is received
    socket.on('updateNickHeader', function(nick) {
        $('#nickHeader').text('You are ' + nick);
    });

    // update userlist when an updateUserlist signal is received
    socket.on('updateUserlist', loadUserlist);

    // flash a status message when a flashStatusMessage signal is received
    socket.on('flashStatusMessage', function(statmsg, dTime) {
        $('#statusmessage').text(statmsg).fadeIn(1).delay(dTime).fadeOut();
    });

    // save a cookie when a saveCookie signal is received
    socket.on('saveCookie', function(data) {
        document.cookie = data;
    });

    // send a signal of chat to server
    $('form').submit(function() {
        socket.emit('chat', $('#inputbox').val());
        $('#inputbox').val('');
        return false;
    });
});