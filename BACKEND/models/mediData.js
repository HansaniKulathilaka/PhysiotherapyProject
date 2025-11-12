const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mediDataSchema = new Schema({
    
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    Question:{
        type: [String],
        required :true
    },
    Q1:{
        type: String,
        default: null 
    },
    Date:{

        type: Date,
        default: null
    },
    Image1:{
        label: { type: String, default: null }, 
    },
    Image2:{
        label: { type: String, default: null },
    },
    Severity:{
       type: Number,
        default: null
    },
    BodyPart:{
        type: String,
        default: null 
    },
    Suggestion:{
        type: String,
        default: null 
    },
    Note:{
        type: String,
        default: null 
    },
    

})

const MediData = mongoose.model("MediData", mediDataSchema);
module.exports = MediData;