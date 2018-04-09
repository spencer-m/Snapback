let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

let User = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
    id: {
        type: String,
        required: true,
    },
    university: {
        type: Schema.ObjectId,
        ref: 'University',
        required: true
    },
    isProfessor: {
        type: Boolean,
        required: true
    },
    courses: [{type: Schema.ObjectId, ref: 'Course'}]
});

User.index({id: 1, university: 1}, {unique: true});

User.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('User', User);