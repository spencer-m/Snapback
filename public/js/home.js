/**
 *  Contains all methods used in the dashboard, headers, and sidebar
 *
 * **/

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

let createClassCard = function(courseCode, courseName, regCode){

    let classCards = $(".main-content");

    // once you reach 3 items in the last row, make a new row
    if (classCards.children('.row').last().children('.col-sm-4').length >= 3) {
        // add buffer between rows
        classCards.append($('<div>').addClass("row top-buffer"));
        // create a new row
        classCards.append($('<div>').addClass('row'));
    }

    (classCards.children('.row').last()).append(
        (($('<div>').addClass('col-sm-4').attr('id', regCode).on('click', function(){

                let regCode = $(this).attr('id');

                $('.main-content').empty();

                $('#class-card-add-button').hide();
                $('#class-card-allClass-button').hide();
                $('#content-header').text(courseCode + ": " + courseName);
                    createLectureQuestionView(regCode);
                }))
            .append(($('<div>').addClass("card card-outline-secondary mb-3"))
                .append(($('<div>').addClass('block'))
                    .append(
                        $('<h3>').addClass('card-title').text(courseCode).css('user-select', 'none'))
                    .append(
                        $('<p>').addClass('card-text').text(courseName).css('user-select', 'none')))
                    .append(
                        $('<p>').text("ID: " + regCode).css('user-select', 'none')
                    )
                )
            ).fadeIn(1000)
    );
};

let populateCourses = function(courses, currDate){
    for (let i = 0; i < courses.length; i++) {
        if (courses[i].year === currDate) {
            createClassCard(courses[i].code, courses[i].name, courses[i].regcode);
        }
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


/**
 * intializeDashboard is only used alongside the "getInfo" socket event
 *
 * It takes the user information retrieved from said event
 *
 * */
let initializeDashboard = function(user){

    $('#content-header').text('Classes');
    $('.sidebar-header h3').text(user.name.first + " " + user.name.last);

    $('.main-content').append($('<div>').addClass('row'));

    let dateInfo = user.date.split(' ');
    let currSemester = dateToSemester(user.date) + " " + dateInfo[1];

    populateCourses(user.courses, currSemester);

    setUpModal(user.isProfessor, getAvailableSemester(user.date));
    setupAllCourseModal(user.courses);
    dropdownClasses(user.courses);

    $('#class-card-add-button').show();
    $('#class-card-allClass-button').show();

    return currSemester;
};

let setupAllCourseModal = function (c) {
    $('#allclass-card-modal .modal-body').empty();
    for(let i = 0; i < c.length; i++){
        $('#allclass-card-modal .modal-body').append($('<p>').text(c[i].code + ": " + c[i].name));
    }
};

let dropdownClasses = function (c) {
    $('#dropdown-content').empty();
    for(let i = 0; i < c.length; i++){
        $('#dropdown-content').append($('<div>').addClass('dropdown-class sidebar-clickable').text(c[i].code));
    }
};