// contains registration keys and universities
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UniSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

let KeySchema = new Schema({
    key: {
        type: String,
        required:  true,
        unique: true
    },
    isUsed: {
        type: Boolean,
        required: true
    }
});

let University = mongoose.model('University', UniSchema);
let Key = mongoose.model('Key', KeySchema);

module.exports = {
    University: University,
    Key: Key
};