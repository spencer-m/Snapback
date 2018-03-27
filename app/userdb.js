let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

let UserSnapback = new Schema({
    username: String,
    password: String
});

UserSnapback.plugin(passportLocalMongoose);

module.exports = mongoose.model('UserSnapback', UserSnapback);