let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

let Users = new Schema({
    username: String,
    password: String
});

Users.plugin(passportLocalMongoose);

module.exports = mongoose.model('Users', Users);