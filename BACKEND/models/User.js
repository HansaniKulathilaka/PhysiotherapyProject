const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    
    UserName:{
        type: String,
        required :true
    },
    Password:{
        type: String,
        required : true
    },
    Email:{
        type: String,
        required : true
    },
    Gender:{
        type: String,
        required : false
    },
    Age:{
        type: Number,
        required : false
    },
    Occupation:{
        type: String,
        required : false
    },
    photo: {
        type: String, 
        required: false,
        default: ""   
    },
    Role:{
        type: String,
        required : false
    },

})

const User = mongoose.model("User", userSchema);
module.exports = User;