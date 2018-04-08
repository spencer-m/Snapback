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
        required: true,
        unique: true
    },
    isUsed: {
        type: Boolean,
        required: true
    }
});

module.exports = {
    University: mongoose.model('University', UniSchema),
    Key: mongoose.model('Key', KeySchema)
};