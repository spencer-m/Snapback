let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

let SnapbackSchema = new Schema({
    username: String,
    password: String
});

SnapbackSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Snapback', SnapbackSchema);