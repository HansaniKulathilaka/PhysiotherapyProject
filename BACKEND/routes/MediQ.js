const router = require("express").Router();
let MediQ = require("../models/mediQ");

router.route("/add").post((req,res) => {
   /* const bodyPart = req.body.bodyPart;
    const Question = req.body.Question;
    */const { bodyPart, Question } = req.body;

     if (!bodyPart || !Question) {
    return res.status(400).json({ status: "Error", message: "bodyPart and Question are required" });
  }

    const newMediQ = new MediQ({
        bodyPart,
        Question
        
    })

    newMediQ.save().then( () => {
        res.json("Question added")
    }).catch( (err) => {
        console.log(err);
    })
})

router.route("/").get((req,res) => {
    MediQ.find().then((mediQ) => {
        res.json(mediQ)
    }).catch((err) => {
        console.log(err)
    })
})

router.get("/bodypart/:partName", async (req, res) => {
  try {
    const partName = req.params.partName;
    const questions = await MediQ.find({ bodyPart: partName });
    res.json(questions);
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error fetching questions", error: err.message });
  }
});





router.route("/update/:id").put(async(req,res) =>{
    try{
    let itemId = req.params.id;
    const {bodyPart,Question} = req.body;

    const updateMediQ = {
        bodyPart,
        Question,
        
    }
    const update = await MediQ.findByIdAndUpdate(itemId, updateMediQ,{ new: true });

    if (!update) {
        return res.status(404).json({ status: "Question not found" });
    }
        res.status(200).send({status:"records updated", item: update});
    

    }catch(err){
        console.log(err);
        res.status(500).send({status: "Error in updating", error: err.message});
    }
    
    

})






router.route("/delete/:id").delete(async(req,res) => {
    let itemId = req.params.id;
    await MediQ.findByIdAndDelete(itemId).then(() => {
        res.status(200).send({status: "deleted successfully"});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "error in deleting", error: err.message});
    })
})




router.route("/get/:id").get(async(req,res) => {
    try{
    let itemId = req.params.id;
    //await stock.findOne(Name)
    const item = await MediQ.findById(itemId);

    if (!item) {
        return res.status(404).json({ message: "Question not found" });
    }
        res.status(200).send({status: "fetched" , data: item});
    }catch(err){
        console.log(err.message);
        res.status(500).send({status: "error in fetching", error: err.message});
    }
    
})





module.exports = router;