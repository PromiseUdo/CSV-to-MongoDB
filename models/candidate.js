const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


//create a staff schema
const candidateSchema = new Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    course:{
        type:String
    },
    phone: {
        type:String,
    },
    password:{
        type:String
    }
});

//will add on fields for username and password, makes them unique and give us additional methods to use


//compile and export
module.exports = mongoose.model('Candidate', candidateSchema);