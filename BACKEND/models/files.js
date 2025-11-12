const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fileSchema = new Schema({
    
    File:{
        type: String,
        required :true
    },
    Title:{
        type: String,
        required : true
    },
   

})

const files = mongoose.model("files", fileSchema);
module.exports = files;