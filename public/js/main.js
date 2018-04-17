// on ready()
socket = io();
userInfo = {};

$(function(){
    let userInfo = {};
    let currSemester = "";

    $('#addSectionButton').hide();

    /** has all info of dude **/
    socket.on('init', function() {

        socket.emit('getInfo', function (info) {
            userInfo = info;

            currSemester = initializeDashboard(info)
        });

    });


    /** LECTURE-SIDE **/

    socket.on('addedFile', function(sectionName, filename) {
        let newFile = new file(sectionName, filename);
        newFile.addFile();
    });

    socket.on('addedSection', function(sectionName) {
        createSection(sectionName);
    });



    /** QUESTION-SESSION-SIDE **/

    socket.on("addedQuestion",function(session_id,addQuestion){
        console.log(addQuestion._id);
        if(session_id == clientSession._id){
            if($('.sessions-list').is(':empty')){
                let newQuestion = new question(addQuestion._id,addQuestion.question,addQuestion.author,addQuestion.date,addQuestion.upvotes,addQuestion.downvotes,addQuestion.comments)
                clientQuestions.push(newQuestion);
                $(".questions-list").append(newQuestion.view());
            }
        }
    });


    socket.on("addedComment",function(question_id,addcomment){

        var question = clientQuestions.find(function(question){
            return question._id == question_id;
        });

        if(question){
            newComment = new comment(addcomment._id,addcomment.author,addcomment.message);
            question.comments.push(newComment);
            question.addComment(newComment);

        }
    });


    socket.on("deletedComment",function(question_id,comment){
        var question = clientQuestions.find(function(question){
            return question._id == question_id;
        });

        if(question){
            question.comments.splice(question.comments.indexOf(comment),1);
            $("#"+comment._id).remove();
        }
    });

    socket.on("voted",function(question_id,user,position){
        var question = clientQuestions.find(function(question){
            return question._id == question_id;
        });

        if(question){
            question.vote(user,position);
        }
    });


    socket.on("deletedQuestion",function(session_id,question_id){
        if(session_id == clientSession._id){
            var question = clientQuestions.find(function(question){
                return question._id == question_id;
            });
            clientQuestions.splice(clientQuestions.indexOf(question),1);
            $("#"+question_id).remove();

        }

    });

    socket.on("toggledSession",function(session_id,bool){
        if(clientSession._id = session_id){
            clientSession.isLive = bool;
            $("#isLive").prop('checked', bool);
        }
        if(bool){
            $(".questions-list").addClass("live");
        }else{
            $(".questions-list").removeClass("live");
        }
    });

    socket.on("addedSession",function(course_id,addSession){
        if(courseID._id = course_id){
            if($('.questions-list').is(':empty')){
                let newSession = new session(addSession._id,addSession.isLive,addSession.name,addSession.questions);
                sessions.push(newSession);
                $(".sessions-list").append(newSession.view());
            }
        }

    });



    /** CONTAINS ALL INTERACTIONS WITH PRE-EXISTING ELEMENTS IN THE HTML FILE **/

    /**
     *  handles sidebar expansion and collapse
     **/
    $('#sidebar-collapse-button').on('click', function () {
        $('#sidebar, #content, .icon-bar').toggleClass('active');
        $('.main-content').toggleClass('active');
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

    $('#addSectionButton').on('click', function(){
        let modalBody = $('#addSectionModal .modal-body');
        $('#addSectionInnerButton').show();
        modalBody.empty();
        modalBody
            .append($('<p>').text("Please enter the section name"))
            .append($('<input>').addClass('form-control')
                .attr('id', "sectionInput").attr("type", "text").attr("placeholder", "Enter section name"));
        $('#addSectionModal').modal("toggle");
    });

    $('.home-button').on('click', function(){

        socket.emit('getInfo', function(info){
            userInfo = info;
            $('.main-content').empty();
            $('#addSectionButton').hide();
            currSemester = initializeDashboard(userInfo);
        })
    });

    $('.dropBtn').on('click', function(){
        $('#dropdown-content').toggleClass('dropped');

        $('#class-icon').toggleClass('fa-caret-down fa-caret-up');

    });

    /**
     * handles the add-class-card button
     *
     * **/
    $('#class-submit-button').on('click', function(){

        let info = {'code':"", 'name':"", 'year':""};

        info.code = $('#course-code-input').val();
        info.name = $('#course-name-input').val();
        info.year = $('#course-date-input').val();

        /** if professor **/
        if (userInfo.isProfessor) {

            socket.emit('addNewClass', info, function (response) {

                let modal = $('#class-card .modal-body');

                if (response.status === 'success') {
                    let registrationCode = response.regcode;

                    socket.emit('getInfo', function (newInfo) {
                        userInfo = newInfo;
                    });

                    setModalMessage("Adding the course was a success!");

                    (modal.append($('<p>').text("Give your students the join code below")))
                        .append($('<p>').addClass('join-code-text').text(registrationCode));

                    if (info.year === currSemester)
                        createClassCard(info.code, info.name, response.regcode);
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

                        setModalMessage('Adding the course was a success!');

                        let lastCourse = userInfo.courses[userInfo.courses.length - 1];
                        let courseName = lastCourse.name;
                        let courseCode = lastCourse.code;

                        createClassCard(courseCode, courseName, lastCourse.regcode);
                        setupAllCourseModal(userInfo.courses);
                    });
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