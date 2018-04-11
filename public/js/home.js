let createClassCard = function(cName, cText){

    // temporary variables
    cName = "Class Name";
    cText = "Blabla class description";


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
};


$(function(){

    let socket = io();
    let userInfo = {};

    /** has all info of dude **/
    socket.on('init', function(info) {
        console.log(info);
        userInfo = info;
    });

    /**
     *  handles sidebar expansion and collapse
     **/
    $('#sidebar-collapse').on('click', function () {
        $('#sidebar, #content, .icon-bar').toggleClass('active');
        $('.class-cards').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');

        /*
        let sidebarButton = "#sidebarBtn";

        $(sidebarButton).toggleClass('.active');


        if ($(sidebarButton).hasClass('sidebar-expand')){
            $(sidebarButton).text(">");
        }
        else {
            $(sidebarButton).text("<");
        }*/
    });

    $('#sidebarBtn').on('click', function () {
       $('.icon-bar.active').removeClass('active');
       $('#sidebar, #content').toggleClass('active');
    });

    /**
     * handles the add-class-card button
     *
     * TODO: There is no space between the two buttons in the newly appended card
     * **/
    $('#class-submit-button').on('click', function(){

        /*info = need code, name and year*/
        let success = false;
        let info = {'code':"", 'name':""};

        /** if professor **/
        if (userInfo.isProfessor) {
            info.code = $('#course-code-input').val();
            info.name = $('course-name-input').val();

            socket.emit('addNewClass', info, function (response) {
                if (response === 'success') {
                    console.log('class creation success');
                    success = true;
                }
                else
                    console.log("class creation error");
            });
        }
        /** if student **/
        if (! userInfo.isProfessor) {
            let code = $('#course-code-input').val();

            socket.emit('enrollToClass', code, function (response) {
                if (response === 'success') {
                    console.log('successfully enrolled');
                    success = true;
                }
                else if (response === 'already_enrolled')
                    console.log('already_enrolled');
                else if (response === 'invalid')
                    console.log('invalid class code');
                else
                    console.log('unknown error');
            });
        }

        if (success){
            $('#course-code-input').val('');

            //TODO: it won't scroll down for some reason
            $('#content').scrollTop($('#content')[0].scrollHeight);
        }

    });

    $('#class-cancel-button').on('click', function() {
        $('#course-code-input').val('');
    });

});
