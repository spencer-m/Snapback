// server side socketio

let User = require('./userdb.js');
let Util = require('./utildb.js');
let Course = require('./coursedb.js');

let io = {};

function generateRandomString() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

io.connection = function(socket) {
        
    
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
                    for (let c in user.courses) {
                        if (c.courseinfo)
                            info.courses.push(c.courseinfo);
                    }
            
                    cb(info);
                });
        }
    });

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

            // generate regcode
            let genRegCode = generateRandomString();
            let toBreak = false;

            while (true) {

                try {
                    Course.Course.findOne({regcode: genRegCode}, function(err, course) {
                        if (err) throw err;
                        if  (course)
                            throw new Error('found');
                        else
                            throw new Error('notfound');
                    });
                }
                catch (err) {
                    if (err.message === 'found')
                        toBreak = false;
                    else if (err.message === 'notfound')
                        toBreak = true;
                    else
                        throw err;
                }

                if (toBreak)
                    break;
            }

            let c = new Course.Course({
                courseinfo: {
                    code: info.code,
                    name: info.name,
                    year: info.year
                },
                regcode: genRegCode,
                professor: socket.request.user._id
            });
            
            c.save();

            User.findById(socket.request.user._id, function(err, user) {

                user.courses.push(c._id);
                user.save();
            });

            let response = {
                status: 'success',
                regcode: genRegCode
            };
            cb(response);
        }
        else
            cb({status: 'failure'});
    });

};

module.exports = io;
