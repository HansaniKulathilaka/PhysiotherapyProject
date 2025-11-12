const router = require("express").Router();
let MediData = require("../models/mediData");

router.route("/add").post((req,res) => {
   if (!req.session.userId) return res.status(401).json("Not logged in");

    
    const Question = req.body.Question;
    const Q1 = req.body.Q1;
    const Date = req.body.Date;
    const Image1 = req.body.Image1;
    const Image2 = req.body.Image2;
    const Severity = req.body.Severity;
    const BodyPart = req.body.BodyPart;
    const Suggestion = req.body.Suggestion;
    const Note = req.body.Note;
    
    const newUser = new MediData({
        UserId: req.session.userId,
        Question,
       Q1,
        Date,
        Image1,
        Image2,
         Severity,
         BodyPart,
         Suggestion,
         Note
    })

    newUser.save().then( () => {
        res.json("records added")
    }).catch( (err) => {
        console.log(err);
    })
})

/*router.route("/").get((req,res) => {
    MediData.find().then((mediData) => {
        res.json(mediData)
    }).catch((err) => {
        console.log(err)
    })
})*/

router.route("/").get(async (req, res) => {
    try {
    const records = await MediData.find().populate("UserId", "UserName Gender Age");
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }


router.put("/:id", async (req, res) => {
  try {
   /* const updated = await MediData.findByIdAndUpdate(
      req.params.id,
      { Suggestion: req.body.Suggestion },
      { new: true }
    );*/
     const updateData = {};
    if (req.body.Suggestion !== undefined) updateData.Suggestion = req.body.Suggestion;
    if (req.body.Note !== undefined) updateData.Note = req.body.Note;

    const updated = await MediData.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});
/*

  if (!req.session.userId) return res.status(401).json("Not logged in");

  try {
    const records = await MediData.find({ UserId: req.session.userId }).populate("UserId");
    //const records = await MediData.find({ UserId: req.session.userId });
    res.json(records);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }*/
});



module.exports = router;