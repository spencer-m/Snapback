const MONTHS = {
    "January":0,
    "February":1,
    "March":2,
    "April":3,
    "May":4,
    "June":5,
    "July":6,
    "August":7,
    "September":8,
    "October":9,
    "November":10,
    "December":11
};

let SEMESTER = {
    "Winter": {"val":0, "start":MONTHS["January"], "end":MONTHS["April"]},
    "Spring": {"val":1, "start":MONTHS["May"], "end":MONTHS["June"]},
    "Summer": {"val":2, "start":MONTHS["July"], "end":MONTHS["August"]},
    "Fall": {"val":3, "start":MONTHS["September"], "end":MONTHS["December"]}
};

let getAvailableSemester = function(date){
    let dateInfo = date.split(' ');
    let month = parseInt(dateInfo[0]);
    let year = parseInt(dateInfo[1]);

    let currentSem = "";
    let availableSemesters = [];
    let allSems = Object.keys(SEMESTER);

    // Retrieves the current semester and adds it to the semesters
    // available to a user
    allSems.forEach(function(sem){
        if (month >= SEMESTER[sem].start && month <= SEMESTER[sem].end ){
            currentSem = sem;
            availableSemesters.push(currentSem + " " + year);
        }
    });

    for (let i = SEMESTER[currentSem].val; i < SEMESTER[currentSem].val + 4; i++){
        let j = i % 4;

        if (j === 3) year++;

        availableSemesters.push(allSems[j] + " " + year);
    }

    console.log(availableSemesters);

    return availableSemesters;
};

let createClassCard = function(cName, cText, cLink){

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
            .append(($('<a>').addClass("card card-outline-secondary mb-3").attr('href', cLink))
                .append(($('<div>').addClass('block'))
                    .append(
                        $('<h3>').addClass('card-title').text(cName))
                    .append(
                        $('<p>').addClass('card-text').text(cText))
                )
            )
    );
};

let populateCourses = function(courses){
    for (let i = 0; i < courses.length; i++)
        createClassCard(courses[i].code, courses[i].name, "#");
};

let setUpModal = function(isProf, sems) {

    $('.modal-body').empty();


    let inputTemplate = function(textInput, id, placeholder) {
        return $('<div>')
            .append($('<p>').text(textInput))
            .append($('<input>')
                .addClass('form-control')
                .attr('id', id)
                .attr('placeholder', placeholder))
    };


    let semesterDropdown = function(availableSemesters) {

        let sDropdown = $('<select>').addClass('form-control').attr("id", "course-date-input").attr("name", "semesters").attr("form","semesterForm");


        availableSemesters.forEach(function(sem) {
            sDropdown.append($('<option>', {value: sem, text: sem}));
        });


        return ($('<div>')
            .append($('<p>').text("Please enter the semester of the course")))
            .append(sDropdown);
    };

    let modalTitle = "";
    $('#class-submit-button').show();

    if (isProf) {
        modalTitle = "Create a Course!";
        (($('.modal-body')
            .append(inputTemplate(
                "Please enter the course name",
                "course-code-input",
                "eg. ANTH 413")))
            .append(inputTemplate(
                "Please enter the course number",
                "course-name-input",
                "eg. History of Western Countries")))
            .append(semesterDropdown(sems));

    }
    else {
        modalTitle = 'Enroll in a Course!';
        ($('.modal-body')
            .append($('<p>').text('Please enter the course code')))
            .append($('<input>')
                .attr('id',"course-id-input")
                .attr('placeholder',"eg. 41Q23AB")
                .attr('autocomplete',"off")
        );
    }

    $('.modal-title').text(modalTitle);
};

// on ready()
$(function(){

    let socket = io();
    let userInfo = {};

    /** has all info of dude **/
    socket.on('init', function() {
        
        socket.emit('getInfo', function (info) {
            userInfo = info;

            $('.sidebar-header h3').text(info.name.first + " " + info.name.last);
            populateCourses(info.courses);
            setUpModal(userInfo.isProfessor, getAvailableSemester(info.date));
        });

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
        let info = {'code':"", 'name':"", 'year':""};

        /** if professor **/
        if (userInfo.isProfessor) {
            info.code = $('#course-code-input').val();
            info.name = $('#course-name-input').val();
            info.year = $('#course-date-input').val();

            socket.emit('addNewClass', info, function (response) {
                console.log('creating a class...');

                if (response.status === 'success') {
                    let registrationCode = response.regcode;

                    socket.emit('getinfo', function (newInfo) {
                        userInfo = newInfo;
                        console.log('textinfront ', newInfo);
                    });

                    let modal = $('.modal-body');

                    modal.empty();
                    $('#class-submit-button').hide();

                    modal.append($('<p>').addClass('modal-message').text('Adding course was a success!'));

                    (modal.append($('<p>').text("Give your students the join code below")))
                        .append($('<p>').addClass('join-code-text').text(registrationCode));

                    console.log(userInfo);

                    let lastCourse = userInfo.courses[userInfo.courses.length - 1];
                    let courseName = lastCourse.name;
                    let courseCode = lastCourse.code;

                    createClassCard(courseName, courseCode, "#");
                    setUpModal(true, getAvailableSemester(userInfo.date));

                    console.log('class creation success');
                }
                else
                    console.log("class creation error");
            });
        }
        /** if student **/
        if (! userInfo.isProfessor) {
            let code = $('#course-id-input').val();

            socket.emit('enrollToClass', code, function (response) {
                if (response === 'success') {
                    console.log('successfully enrolled');

                    socket.emit('getInfo', function (info) {
                        userInfo = info;
                    });

                    let modal = $('.modal-body');

                    modal.empty();
                    $('#class-submit-button').hide();
                    modal.append($('<p>').addClass('modal-message').text('Adding course was a success!'));

                    let lastCourse = userInfo.courses[userInfo.courses.length - 1];

                    console.log(lastCourse);

                    let courseName = lastCourse.name;
                    let courseCode = lastCourse.code;

                    createClassCard(courseName, courseCode, "#");
                    setUpModal(false, getAvailableSemester(userInfo.date));
                }
                else if (response === 'already_enrolled')
                    console.log('already_enrolled');
                else if (response === 'invalid')
                    console.log('invalid class code');
                else
                    console.log('unknown error');
            });
        }

        socket.emit('getInfo', function(info){
            userInfo = info;
        });

        $('#course-id-input').val('');

            //TODO: it won't scroll down for some reason
        $('#content').scrollTop($('#content')[0].scrollHeight);

    });

    $('#class-cancel-button').on('click', function() {
        $('#course-code-input').val('');
    });

});
