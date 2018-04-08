$(function(){

    /**
     *  handles sidebar expansion and collapse
     **/
    $('#sidebar-collapse').on('click', function () {
        $('#sidebar, #content, #sidebar-collapse').toggleClass('active');
        $('.class-cards').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');

        let sidebarButton = "#sidebar button";

        $(sidebarButton).toggleClass('sidebar-expand');

        if ($(sidebarButton).hasClass('sidebar-expand')){
            $(sidebarButton).text(">");
        }
        else {
            $(sidebarButton).text("<");
        }
    });

    /**
     * handles the add-class-card button
     *
     * TODO: There is no space between the two buttons in the newly appended card
     * **/
    $('#class-submit-button').on('click', function(){
        let cName = "Class Name";
        let cText = "Blabla class description";
        let classCards = $(".class-cards");

        // once you reach 3 items in the last row, make a new row
        if (classCards.children('.row').last().children('.col-sm-4').length >= 3) {
            // add buffer between rows
            classCards.append($('<div>').addClass("row top-buffer"));
            // create a new row
            classCards.append($('<div>').addClass('row'));
        }

        (classCards.children('.row').last()).append(
            ($('<div>').addClass('col-sm-4'))
                .append(($('<div>').addClass("card card-outline-secondary mb-3"))
                    .append(($('<div>').addClass('block'))
                        .append(
                            $('<h3>').addClass('card-title').text(cName))
                        .append(
                            $('<p>').addClass('card-text').text(cText))
                        .append(
                            $('<a>').attr('href','#').addClass('btn btn-dark btn-sm').text("Files"))
                        .append(' ')
                        .append(
                            $('<a>').attr('href','#').addClass('btn btn-dark btn-sm').text("QA"))
                    )
                )
        );

        //TODO: trying to erase the previous input after pressing submit
        $('#course-code-input').val('');

        //TODO: it won't scroll down for some reason
        $('#content').scrollTop($('#content')[0].scrollHeight);


    });

    //TODO: trying to erase the previous input after pressing cancel
    $('#class-cancel-button').on('click', function() {
        $('#course-code-input').val('');
    });

    let socket = io();

    socket.on('init', function(info) {
        console.log(info);
    });

    $('#addClass').click(function() {
        let code = $('#classcode').val(); 
      
        socket.emit('entrollToClass', code, function(response) {
            if (response === 'success')
                console.log('successfully enrolled');
            else if (response == 'already_enrolled')
                console.log('already_enrolled');
            else if (response == 'invalid')
                console.log('invalid class code');
            else
                console.log('unknown error');
        });
    });
});
