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

let dateToSemester = function(date){
    let dateInfo = date.split(' ');
    let month = parseInt(dateInfo[0]);
    let allSems = Object.keys(SEMESTER);

    let currSem = "";

    allSems.forEach(function(sem){
        if (month >= SEMESTER[sem].start && month <= SEMESTER[sem].end ){
            currSem = sem;
        }
    });

    return currSem;
};

let getAvailableSemester = function(date){
    let dateInfo = date.split(' ');
    let year = parseInt(dateInfo[1]);

    let currentSem = dateToSemester(date);
    let semInfo = currentSem.split(' ');
    let curSem = semInfo[0];

    let availableSemesters = [];
    let allSems = Object.keys(SEMESTER);

    availableSemesters.push(curSem + " " + year);

    for (let i = SEMESTER[curSem].val + 1; i < SEMESTER[curSem].val + 4; i++){
        let j = i % 4;

        if (j === 3) year++;

        availableSemesters.push(allSems[j] + " " + year);
    }

    return availableSemesters;
};

let createClassCard = function(courseCode, courseName, regCode, cLink){

    let classCards = $(".class-cards");

    // once you reach 3 items in the last row, make a new row
    if (classCards.children('.row').last().children('.col-sm-4').length >= 3) {
        // add buffer between rows
        classCards.append($('<div>').addClass("row top-buffer"));
        // create a new row
        classCards.append($('<div>').addClass('row'));
    }

    (classCards.children('.row').last()).append(
        (($('<div>').addClass('col-sm-4'))
            .append(($('<a>').addClass("card card-outline-secondary mb-3").attr('href', cLink))
                .append(($('<div>').addClass('block'))
                    .append(
                        $('<h3>').addClass('card-title').text(courseCode))
                    .append(
                        $('<p>').addClass('card-text').text(courseName)))
                    .append(
                        $('<p>').text("ID: " + regCode)
                    )
                )
            )
    );
};

let populateCourses = function(courses, currDate){
    for (let i = 0; i < courses.length; i++) {
        if (courses[i].year === currDate)
            createClassCard(courses[i].code, courses[i].name, courses[i].regcode, "#");
    }
};

let setModalMessage = function(message) {
    let modal = $('#class-card-modal .modal-body');

    modal.empty();
    $('#class-submit-button').hide();
    $('#class-back-button').show();
    modal.append($('<p>').addClass('modal-message').text(message));
};

let setUpModal = function(isProf, sems) {

    $('#class-card-modal .modal-body').empty();

    let inputTemplate = function(textInput, id, placeholder) {
        return $('<div>')
            .append($('<p>').text(textInput))
            .append($('<input>')
                .addClass('form-control modal-input')
                .attr('id', id)
                .attr('placeholder', placeholder))
    };


    let semesterDropdown = function(availableSemesters) {

        let sDropdown = $('<select>').addClass('form-control modal-input').attr("id", "course-date-input").attr("name", "semesters").attr("form","semesterForm");

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
        (($('#class-card-modal .modal-body')
            .append(inputTemplate(
                "Please enter the course code",
                "course-code-input",
                "eg. ANTH 413")))
            .append(inputTemplate(
                "Please enter the course name",
                "course-name-input",
                "eg. History of Western Countries")))
            .append(semesterDropdown(sems));

    }
    else {
        modalTitle = 'Enroll in a Course!';
        ($('#class-card-modal .modal-body')
            .append($('<p>').text('Please enter the course code')))
            .append($('<input>')
                .attr('id',"course-id-input")
                .attr('placeholder',"eg. 41Q23AB")
                .attr('autocomplete',"off")
        );
    }

    $('#class-card-modal .modal-title').text(modalTitle);
};

// on ready()
$(function(){

    let socket = io();
    let userInfo = {};
    let currSemester = "";

    /** has all info of dude **/
    socket.on('init', function() {
        
        socket.emit('getInfo', function (info) {
            userInfo = info;

            let dateInfo = info.date.split(' ');
            currSemester = dateToSemester(info.date) + " " + dateInfo[1];

            $('.sidebar-header h3').text(info.name.first + " " + info.name.last);
            populateCourses(info.courses, currSemester);
            setUpModal(userInfo.isProfessor, getAvailableSemester(info.date));
            setupAllCourseModal(info.courses);
            dropdownClasses(info.courses);
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
    });

    $('#sidebarBtn').on('click', function () {
       $('.icon-bar.active').removeClass('active');
       $('#sidebar, #content').toggleClass('active');
    });

    $('#class-back-button').on('click', function(){
        $('#class-back-button').hide();
        $('#class-submit-button').show();
        $('#class-card-modal .modal-body').empty();
        setUpModal(userInfo.isProfessor, getAvailableSemester(userInfo.date));
    });

    $('#class-card-add-button').on('click', function(){
        setUpModal(userInfo.isProfessor, getAvailableSemester(userInfo.date));

        $('#class-back-button').hide();
        $('#class-submit-button').show();
    });

    /**
     * handles the add-class-card button
     *
     * TODO: There is no space between the two buttons in the newly appended card
     * **/
    $('#class-submit-button').on('click', function(){
        let modal = $('#class-card.modal-body');

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
                    });

                    setModalMessage("Adding the course was a success!");

                    (modal.append($('<p>').text("Give your students the join code below")))
                        .append($('<p>').addClass('join-code-text').text(registrationCode));

                    let lastCourse = userInfo.courses[userInfo.courses.length - 1];
                    let courseName = lastCourse.name;
                    let courseCode = lastCourse.code;

                    if (info.year === currSemester)
                        createClassCard(courseName, courseCode, response.regcode, "#");
                    setupAllCourseModal(userInfo.courses);

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

                console.log(response.status);

                if (response.status === 'success') {
                    console.log('successfully enrolled');

                    socket.emit('getInfo', function (info) {
                        userInfo = info;
                    });

                    setModalMessage('Adding the course was a success!');
                    
                    let lastCourse = userInfo.courses[userInfo.courses.length - 1];
                    let courseName = lastCourse.name;
                    let courseCode = lastCourse.code;

                    createClassCard(courseName, courseCode, lastCourse.regcode, "#");
                }
                else if (response.status === 'already_enrolled'){
                    console.log('already_enrolled');

                    setModalMessage('You already have this course!');
                }
                else if (response.status === 'invalid'){
                    console.log('invalid class code');

                    setModalMessage("This course doesn't exist... ):");
                }
                else {
                    setModalMessage("ERROR");
                    console.log('unknown error');
                }
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

let setupAllCourseModal = function (c) {
    $('#allclass-card-modal .modal-body').empty();
    for(let i = 0; i < c.length; i++){
        $('#allclass-card-modal .modal-body').append($('<p>').text(c[i].code + ": " + c[i].name));
    }
};

let dropdownClasses = function (c) {
    $('#dropdown-content').empty();
    for(let i = 0; i < c.length; i++){
        $('#dropdown-content').append($('<a>').text(c[i].code).attr('href', "#"));
    }
};