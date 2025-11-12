const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mediQSchema = new Schema({
    
    bodyPart: {
    type: String,
    required: true, 
  },
   
    Question:{
        type: String,
        required : true
    }

    
})

const MediQ = mongoose.model("MediQ", mediQSchema);
module.exports = MediQ;