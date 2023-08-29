require('dotenv').config();
const UserModel = require('../models/userModels');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const secret = process.env.SECRET;
const validateUser = async (user) => {

    try {
        const response = await UserModel.find({email:user.email}).limit(1);

        if(response[0]) return false;

        return true;

    } catch (err) {

        console.error({"Error`":err});

        return false;
    }
}



const validatePassword = (password) => {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    if(!password.match(passwordRegex)) return false;
    
    return true;
}

const confirmPassword = async (password, hashed) => {
    // console.log(password,hashed)
    const result = await bcrypt.compare(password,hashed);

    return result;
}

const generateToken = (user) => {
    let now = Math.floor(Date.now()/1000);        // get unix now
    
    user = filterUser(user.toJSON());

    const unhashed = {
        iis:'token_generator',
        sub:'auth',
        nbf:now-5,
        iat: now,
        exp: now + (6*3600),
        context:user,
    }

    const token = jwt.sign(unhashed,secret);

    return token;
}

const filterUser = (user) => {

    delete user['password']; // unset password;
     
    user.displayName = user.fname + " " + user.lname;

    return user;
}

const generatePassword = async (password) => {
    // validate password
    if(!validatePassword(password)) return false;
    // generate salt
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword =  await bcrypt.hash(password,salt);


    return hashedPassword;
}

module.exports = {

    validateUser,
    generatePassword,
    confirmPassword,
    generateToken,

}