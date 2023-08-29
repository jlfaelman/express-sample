require('dotenv').config();
const mongoose = require('mongoose');
const conn = mongoose.createConnection();

const username = process.env.DB_USERNAME;   
const password = process.env.DB_PASSWORD;   
const cluster = process.env.DB_CLUSTER;   
const dbname = process.env.DB_NAME;   



mongoose.connect(
    process.env.DB_URI,
    {
        useNewUrlParser: true,
        // useFindAndModify: false,
        useUnifiedTopology: true
    })

mongoose.connection.on('error',function(err){
    console.log("Error: "+err)
})
mongoose.connection.on('connected',function(){
    console.log('Connected to dB!')
})
module.exports = mongoose;