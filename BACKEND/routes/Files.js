const router = require("express").Router();
let files = require("../models/files");
const multer = require("multer");
const path = require('path');


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./files");
    },
    filename: function(req,file,cb){
        const uniqueSuffix = Date.now();
        cb(null,uniqueSuffix + file.originalname);
    }
});

const upload = multer({storage})

router.post("/addFile", upload.single("file"), async(req,res)=>{
    try{
        if (!req.file || !req.body.title) {
            return res.status(400).send({ status: "error", message: "Title or file missing" });
        }

        const title = req.body.title;
        const fileName = req.file.filename;

        const newFile = new files({
            Title: title,
            File: fileName
        });

        await newFile.save();
        console.log("PDF uploaded successfully");
        res.send({ status: 200, message: "File uploaded successfully" });
    }catch(err){
        console.log(err);
        res.status(500).send({status: "error"});
    }
});

router.get("/getFile", async(req,res)=> {
    try{
        const allFiles = await files.find();
        res.send({status: 200, data: allFiles});
    }catch(err){
        console.log(err);
        res.status(500).send({status: "error"});
    }
});

router.get("/files/:file", (req, res) => {
    const fileName = req.params.file;
    const filePath = path.join(__dirname,'..', 'files', fileName);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.log(err);
            res.status(404).send({ status: "error", message: "File not found" });
        }
    });
});

module.exports = router;