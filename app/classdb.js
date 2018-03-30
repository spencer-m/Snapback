let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Class = new Schema({
    name: {
        code: {
            type: String,
            required: true
        },
        cname: {
            type: String,
            required: true
        }
    },
    //class list
    //year: fall 2018
    questions: { // array of sessions
        session: {
            // isSessionLive
            // timeSpanActive
            // array pf questions
            // a question is
            // score
            //[userupvote]
            //[userdownvote]
            // [comments: {user, msg}]
        }
    },
    lectures: {
        // sections? asignments, lectures, tests
        files: {
            type: Array
        }
    }

});

module.exports = mongoose.model('Class', Class);