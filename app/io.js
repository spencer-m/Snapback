// server side socketio

let User = require('./userdb.js');
let Util = require('./utildb.js');
let Course = require('./coursedb.js');

let io = {};

io.connection = function(socket) {
        
    
    /* connection initialiation */

    console.log(':::socketio::: user: ', socket.request.user);
    /*
    :::socketio::: user:  { 
        name: { first: 'lorem', last: 'ipsum' },
        courses: [],
        _id: 5ac9cc7f6bde4642140c7cfd,
        email: 'lorem@lorem.com',
        id: '1234',
        university: 5ac9c9d73bc0b11930c8edad,
        isProfessor: false,
        __v: 0 }

        to get university name:

    */

    if (socket.request.user.logged_in) {

        User.
            findById(socket.request.user._id).
            populate('courses').
            populate('university').
            exec(function(err, user) {

                if (err) throw err;

                let info = {
                    name: user.name,
                    email: user.email,
                    id: user.id,
                    isProfessor: user.isProfessor,
                    university: user.university.name,
                    courses: []
                };
                for (let c in user.courses) {
                    if (c.courseinfo)
                        info.courses.push(c.courseinfo);
                }

                socket.emit('init', info);
            });
    }

    /* enrolling to course */

    socket.on('enrollToClass', function(code, cb) {
        if (socket.request.user.logged_in) {

            Course.findOne({regcode: code}, function(err, course) {

                if (err) throw err;

                // course exists
                if (course) {

                    // check if already registered, if not then save course to student
                    User.findById(socket.request.user._id, function(err, user) {

                        if (err) throw err;

                        if (course._id in user.courses)
                            cb('already_enrolled')
                        else {
                            course.classlist.push(user._id);
                            course.save();
                            user.courses.push(course._id);
                            user.save();
                            cb('success');
                        }
                    });
                }
                // course does not exists
                else {
                    for (let i = 0; i < 10000; i ++)
                        continue;
                    cb('invalid');
                }
            });
        }
    });

    /* adding course - PROFESSOR */

    socket.on('addNewClass', function(info, cb) {

        if (socket.request.user.logged_in && socket.request.user.isProfessor) {
            console.log('prof add');
            /*
            info : {
                courseinfo: {
                code: SENG 513
                name: Web based sysems
                year: 2018
                },
                professor: socket.request.user._id
            }
            */

        }
    });

};

module.exports = io;
