const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const stockSchema = new Schema({
    
    ID:{
        type: Number,
        required :true
    },
    Name:{
        type: String,
        required : true
    },


    Category:{
        type: String,
        required : true
    },

    Quantity:{
        type: Number,
        required : true
    },
    Status:{
        type: String,
        required : true
    },



})

const Stock = mongoose.model("Stock", stockSchema);
module.exports = Stock;