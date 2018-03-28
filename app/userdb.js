let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

let Users = new Schema({
    email: String,
    password: String
});

Users.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('Users', Users);

/*
const UserSchema = new Schema({
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
  email: {
    match: emailAddress,
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  admin: Boolean
});
*/