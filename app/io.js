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
                            let ci = JSON.parse(JSON.stringify(user.courses[i].courseinfo));
                            ci.regcode = user.courses[i].regcode;
                            info.courses.push(ci);
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

                        //populate lectures etc
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

        socket.on('addSection', function(cid, sectionName, cb) {

            Course.Course.
                findById(cid).
                populate('lectures').
                exec(function(err, course) {
                    if (err) throw err;
                
                    // check if section name is already in the course
                    let exists = false;
                    for (let i = 0; i < course.lectures.length; i++) {
                        if (course.lectures[i].name === sectionName) {
                            exists = true;
                            break;
                        }
                    }

                    if (exists)
                        cb({status: 'exists'});
                    else {
                        let s = Course.Section({
                            name: sectionName
                        });
                        s.save();
                        course.lectures.push(s._id);
                        course.save();
                        io.in(cid).emit('addedSection', sectionName);
                        cb({status: 'success'});
                    }
                });
        });

        socket.on('getSections', function(cid, cb) {

            Course.Course.
                findById(cid).
                populate({
                    path: 'lectures',
                    populate: {path: 'files'}
                }).
                exec(function(err, course) {
                    if (err) throw err;

                    if (course) {

                        let s = JSON.parse(JSON.stringify(course.lectures));
                        cb(s);
                    }
                });
        });

        socket.on('addFile', function(cid, sectionName, file, cb) {

            if (file.size > 10000000)
                cb({status: 'filetoobig'});
            else {
                Course.Course.
                    findById(cid).
                    populate('lectures').
                    exec(function(err, course) {
                        if (err) throw err;

                        let sid;

                        if (course) {
                            for (let i = 0; i < course.lectures.length; i++) {
                                if (course.lectures[i].name === sectionName) {
                                    sid = course.lectures[i]._id;
                                    break;
                                }
                            }

                            Course.Section.
                                findById(sid).
                                populate('files').
                                exec( function(err, section) {

                                    if (err) throw err;

                                    // check if file name is already in the section
                                    let exists = false;
                                    for (let i = 0; i < section.files.length; i++) {
                                        if (section.files[i].name === file.name) {
                                            exists = true;
                                            break;
                                        }
                                    }

                                    if (exists)
                                        cb({status: 'exists'});
                                    else {
                                        let f = Course.Files({
                                            name: file.name,
                                            data: file.data
                                        });
                                        f.save();
                                        section.files.push(f._id);
                                        section.save();
                                        io.in(cid).emit('addedFile', section.name, file.name);
                                        cb({status: 'success'});
                                    }
                                });
                        }
                    });
            }
        });

        socket.on('getFile', function(cid, sectionName, fileName, cb) {
            
            Course.Course.
                findById(cid).
                populate('lectures').
                exec(function(err, course) {
                    if (err) throw err;

                    if (course) {
                        let sid;
                        
                        for (let i = 0; i < course.lectures.length; i++) {
                            if (course.lectures[i].name === sectionName) {
                                sid = course.lectures[i]._id;
                                break;
                            }
                        }
                        
                        Course.Section.findById(sid).populate('files').exec(function(err, section) {
                            if (err) throw err;
                        
                            let fid;
                            for (let i = 0; i < section.files.length; i++) {
                                if (section.files[i].name === fileName) {
                                    fid = section.files[i]._id;
                                    break;
                                }
                            }
                        
                            Course.Files.findById(fid, function(err, file) {
                                cb(file);
                            });
                        });
                    }
                });
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
    
        socket.on('deleteQuestion', function(cid, session_id, question_id) {
    
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

        socket.on('vote', function(cid, question_id, state) {

            if (state === -1) {
                Course.Question.findByIdAndUpdate(question_id, {$pullAll: {upvotes: [socket.request.user._id]}, $addToSet: {downvotes: socket.request.user._id}}, function(err) {
                    if (err) throw err;
                    io.in(cid).emit('voted', question_id, socket.request.user._id, state);
                });
            }
            else if (state === 0) {
                Course.Question.findByIdAndUpdate(question_id, {$pullAll: {upvotes: [socket.request.user._id], downvotes: [socket.request.user._id]}}, function(err) {
                    if (err) throw err;
                    io.in(cid).emit('voted', question_id, socket.request.user._id, state);
                });
            }
            else if (state === 1) {
                Course.Question.findByIdAndUpdate(question_id, {$pullAll: {downvotes: [socket.request.user._id]}, $addToSet: {upvotes: socket.request.user._id}}, function(err) {
                    if (err) throw err;
                    io.in(cid).emit('voted', question_id, socket.request.user._id, state);
                });
            } 
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

        socket.on('addSession', function(class_id, session, cb) {

            let s = new Course.Session({
                name: session.name,
                isLive: session.isLive
            });
            s.save();

            Course.Course.findById(class_id, function(err, course) {
                if (err) throw err;
                
                course.sessions.push(s._id);
                course.save();
                session._id = s._id;
                io.in(cid).emit('addedSession', class_id, session);
                cb('success');
            });
        });
        
        socket.on('getSession', function(session_id, cb) {

            Course.Session.
                findById(session_id).
                populate({
                    path: 'questions',
                    populate: {path: 'comments'}
                }).
                exec(function(err, session) {
                    if (err) throw err;
                    
                    cb(JSON.parse(JSON.stringify(session.questions)));
                });

        });

        socket.on('toggleSession', function(cid, session_id, state) {
            Course.Session.findByIdAndUpdate(session_id, {isLive: state}, function(err) {
                if (err) throw err;
                io.in(cid).emit('toggledSession', session_id, state);
            });
        });
    
    // end io function
    });
};

// notes:
// existing class when register not working
