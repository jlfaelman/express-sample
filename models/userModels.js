const mongoose = require('../services/db');

const UserSchema = new mongoose.Schema({
    fname:String,
    lname:String,
    age:String,
    email:String,
    password:String,
    address:Object,
})

const UserModel = mongoose.model('User', UserSchema,'users')


module.exports = UserModel;