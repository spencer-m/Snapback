// server side socketio

let User = require('./userdb.js');
let Util = require('./utildb.js');
let Course = require('./coursedb.js');

let isIdInArray = function(id, arr) {
    let result = false;
    arr = JSON.parse(JSON.stringify(arr));
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == id) {
            result = true;
            break;
        }
    }
    
    return result;
};

module.exports = function(io) {
    
    io.on('connection', function(socket) {
        
        /* connection initialiation */

        console.log(':::socketio::: user: ', socket.request.user);

        socket.emit('init');

        socket.on('getInfo', function(cb){

            if (socket.request.user.logged_in) {
                User.
                    findById(socket.request.user._id).
                    populate('courses').
                    populate('university').
                    exec(function(err, user) {
            
                        if (err) throw err;
            
                        let d = new Date();
            
                        let info = {
                            name: user.name,
                            email: user.email,
                            id: user.id,
                            isProfessor: user.isProfessor,
                            university: user.university.name,
                            courses: [],
                            date: d.getMonth() + ' ' + d.getFullYear() 
                        };

                        for (let i = 0; i < user.courses.length; i++) {
                        let x = {
                            code: user.courses[i].courseinfo.code,
                            name: user.courses[i].courseinfo.name,
                            year: user.courses[i].courseinfo.year,
                            regcode: user.courses[i].regcode
                        };

                        info.courses.push(x);
                    	}
            
                        cb(info);
                    });
            }
        });

        /* enrolling to course */

        socket.on('enrollToClass', function(code, cb) {

            if (socket.request.user.logged_in) {

                Course.Course.findOne({regcode: code}, function(err, course) {

                    if (err) throw err;

                    // course exists
                    if (course) {

                    // check if already registered, if not then save course to student
                        User.findById(socket.request.user._id, function(err, user) {

                            if (err) throw err;

                            if (isIdInArray(course._id, user.courses))
                                cb({status: 'already_enrolled'});
                            else {
                                course.classlist.push(user._id);
                                course.save();
                                user.courses.push(course._id);
                                user.save();
                                cb({status: 'success'});
                            }
                        });
                    }
                    // course does not exists
                    else {
                        for (let i = 0; i < 10000; i ++)
                            continue;
                        cb({status: 'invalid'});
                    }
                });
            }
        });

        /* adding course - PROFESSOR */

        socket.on('addNewClass', function(info, cb) {

            if (socket.request.user.logged_in && socket.request.user.isProfessor) {

                let generateRandomString = function() {
                
                    let text = '';
                    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                      
                    for (var i = 0; i < 6; i++)
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                      
                    return text;
                };

                let createAndSaveClass = function casc() {

                    let generatedCode = generateRandomString();

                    Course.Course.findOne({regcode: generatedCode}, function(err, course) {
                    
                        if (err) throw err;
                
                        if (course) {
                        // redo createAndSaveClass with new random registration code
                            console.log('collision');
                            casc();
                        }
                        else {
                            console.log('create course object');
                            let c = new Course.Course({
                                courseinfo: {
                                    code: info.code,
                                    name: info.name,
                                    year: info.year
                                },
                                regcode: generatedCode,
                                professor: socket.request.user._id
                            });
                    
                            c.save();
                            console.log('saved course');

                            User.findById(socket.request.user._id, function(err, user) {
                        
                                if (err) throw err;

                                user.courses.push(c._id);
                                user.save();
                            });

                            let response = {
                                status: 'success',
                                regcode: c.regcode
                            };
                            cb(response);
                        }
                    });
                }();
            }
            else
                cb({status: 'failure'});
        });

        /* accessing a class */

        socket.on('loadClass', function(regcode, cb) {
        
            if (socket.request.user.logged_in) {

                Course.Course.findOne({regcode: regcode}, function(err, course) {
                
                    if (err) throw err;

                    if (course) {

                        let cid = course._id;

                        User.findById(socket.request.user._id, function(err, user) {
                        
                            if (err) throw err;

                            if ((user) && (isIdInArray(cid, user.courses))) {

                                Course.Course.
                                    findById(cid).
                                    populate('sessions').
                                    exec(function(err, course) {
                                                    
                                        if (err) throw err;
                        
                                        if (course)
                                            cb(JSON.parse(JSON.stringify(socket.request.user)), JSON.parse(JSON.stringify(course)));
                                    });
                                // TODO
                                socket.join(cid);
                            }
                        });
                    }
                });
            }
        });

        /**
     * Missing:
     *  isloggedin verification
     *  server side verification
     */

        socket.on('addQuestion', function(cid, session_id, question) {

        // create question
            let q = new Course.Question({
                authorid: socket.request.user._id,
                author: question.author,
                question: question.question,
                date: question.date
            });
            q.save();

            // add question to session
            Course.Session.findById(session_id, function(err, session) {
            
                if (err) throw err;

                session.questions.push(q._id);
                session.save();
            
                // TODO
                // verfiy it works
                question._id = q._id;
                io.in(cid).emit('addedQuestion', session_id, question);
            });
        });

        socket.on('addComment', function(cid, question_id, comment) {
        
        // create comment
            let c = new Course.Comment({
                authorid: socket.request.user._id,
                author: comment.author,
                message: comment.message
            });
            c.save();

            // add comment to question
            Course.Question.findById(question_id, function(err, question) {
            
                if (err) throw err;
            
                question.comments.push(c._id);
                question.save();
            
                // TODO
                // verfiy it works
                comment._id = c._id;
                io.in(cid).emit('addedComment', question_id, comment);
            });
        });

        socket.on('deleteComment', function(cid, question_id, comment) {

            let comment_id = comment._id;

            // remove association of comment in question
            Course.Question.findByIdAndUpdate(question_id, {$pullAll: {comments: [comment_id]}}, function(err) {
                if (err) throw err;
            });

            // destroy comment
            Course.Comment.findByIdAndRemove(comment_id, function(err) {
                if (err) throw err;
                // TODO
                // verfiy it works
                io.in(cid).emit('deletedComment', question_id, comment);
            });
        });

        // TODO
        // change to vote
        // -1 is down, 0 is none, 1 is up
        socket.on('upvote', function(cid, question_id) {
        
            Course.Question.findById(question_id, function(err, question) {
            
            // toggle: remove from upvote
                if (isIdInArray(socket.request.user._id, question.upvotes)) {
                // remove from upvote
                    question.upvotes = question.upvotes.filter(function(user) {
                        return user !== socket.request.user._id;
                    });
                }
                // remove from downvote and add to upvote
                else if (isIdInArray(socket.request.user._id, question.downvotes)) {

                // remove from downvote
                    question.downvotes = question.downvotes.filter(function(user) {
                        return user !== socket.request.user._id;
                    });
                    // add to upvote
                    question.upvotes.push(socket.request.user._id);
                }
                // add to upvote
                else 
                    question.upvotes.push(socket.request.user._id);

                // update
                question.save();

                // TODO
                // verfiy it works

                io.in(cid).emit('upvoted', question_id, socket.request.user._id);
            });
        });

        socket.on('downvote', function(cid, question_id) {
        
            Course.Question.findById(question_id, function(err, question) {
            
            // toggle: remove from downvote
                if (isIdInArray(socket.request.user._id, question.downvotes)) {
                // remove from downvote
                    question.downvotes = question.downvotes.filter(function(user) {
                        return user !== socket.request.user._id;
                    });
                }
                // remove from upvote and add to downvote
                else if (isIdInArray(socket.request.user._id, question.downvotes)) {

                // remove from upvote
                    question.upvotes = question.upvotes.filter(function(user) {
                        return user !== socket.request.user._id;
                    });
                    // add to downvote
                    question.downvotes.push(socket.request.user._id);
                }
                // add to downvote
                else 
                    question.downvotes.push(socket.request.user._id);

                // update
                question.save();

                // TODO
                // verfiy it works
                
                io.in(cid).emit('downvoted', question_id, socket.request.user._id);
            });
        });
    
        socket.on('deleteQuestion', function(cid, session_id, question_id) {
            console.log(question_id);
        // remove association of question in session
            Course.Session.findByIdAndUpdate(session_id, {$pullAll: {questions: [question_id]}}, function(err) {
                if (err) throw err;
            });

            // remove comments associated with question
            Course.Question.findById(question_id, function(err, question) {

                if (err) throw err;

                if (question) {
                    for (let i = 0; i < question.comments.length; i++) {
                    // destroy comment
                        Course.Comment.findByIdAndRemove(question.comments[i]._id, function(err) {
                            if (err) throw err;
                        });
                    }
                }
            });

            // destroy question
            Course.Question.findByIdAndRemove(question_id, function(err) {
                if (err) throw err;
                // TODO
                // verfiy it works
                io.in(cid).emit('deletedQuestion', session_id, question_id);
            });
        });

        socket.on('getSession', function(session_id, cb) {

            Course.Session.
                findById(session_id).
                populate('questions').
                populate('questions.upvotes').
                populate('questions.downvotes').
                populate('questions.comments').
                exec(function(err, session) {
                    if (err) throw err;
                
                    cb(JSON.parse(JSON.stringify(session.questions)));
                });

        });

        socket.on('addSession', function(class_id, session) {

            let s = new Course.Session({
                name: session.name,
                isLive: session.isLive
            });
            s.save();

            Course.Course.findById(class_id, function(err, course) {

                course.sessions.push(s._id);
                course.save();
            });
        });
    
    // end io function
    });
};

// notes:
// existing class when register not working
