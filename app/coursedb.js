let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CommentsSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

let QuestionSchema = new Schema({

    question: {
        type: String,
        required: true
    },
    upvoters: {
        type: [{type: Schema.ObjectId, ref: 'User'}],
        default: []
    },
    downvoters: {
        type: [{type: Schema.ObjectId, ref: 'User'}],
        default: []
    },
    // array of comments
    comments: {
        type: [{type: Schema.ObjectId, ref: 'Comments'}],
        default: []
    }
});

let SessionSchema = new Schema({
    session: {
        name: {
            type: String,
            required: true
        },
        isSessionLive: {
            type: Boolean,
            required: true
        },
        timeStart: {
            type: Date,
            required: true
        },
        timeEnd: {
            type: Date,
            required: true
        },
        // array of questions
        questions: {
            type: [{type: Schema.ObjectId, ref: 'Question'}],
            default: []
        }
    }
});

let FileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: Buffer,
        required: true
    }
});

let SectionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    files: {
        type: [{type: Schema.ObjectId, ref: 'Files'}]
    }
});

let CourseSchema = new Schema({
    courseinfo: {
        // i.e. SENG 513
        code: {
            type: String,
            required: true
        },
        // i.e. Web-based Systems
        name: {
            type: String,
            required: true
        },
        // i.e. 2018
        year: {
            type: String,
            required: true
        }
    },
    regcode: {
        type: String,
        required: true
    },
    // array of users
    classlist: {
        type: [{type: Schema.ObjectId, ref: 'User'}],
        default: []
    },
    // array of sessions
    sessions: {
        type: [{type: Schema.ObjectId, ref: 'SessionQ'}],
        default: []
    },
    lectures: {
        type: [{type: Schema.ObjectId, ref: 'Section'}],
        default: []
    }
});

module.exports = {
    Course: mongoose.model('Course', CourseSchema),
    Session: mongoose.model('SessionQ', SessionSchema),
    Question: mongoose.model('Question', QuestionSchema),
    Comment: mongoose.model('Comments', CommentsSchema),
    Section: mongoose.model('Section', SectionSchema),
    Files: mongoose.model('Files', FileSchema)
};