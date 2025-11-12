const router = require("express").Router();
let stock = require("../models/stock");

router.route("/add").post((req,res) => {
    const ID = Number(req.body.ID);
    const Name = req.body.Name;

    const Category = req.body.Category;
    const Quantity = req.body.Quantity;
    const Status = req.body.Status;

    const newStock = new stock({
        ID,
        Name,
        Category,
        Quantity,
        Status
    })

    newStock.save().then( () => {
        res.json("Stock added")
    }).catch( (err) => {
        console.log(err);
    })
})

router.route("/").get((req,res) => {
    stock.find().then((stock) => {
        res.json(stock)
    }).catch((err) => {
        console.log(err)
    })
})


/*router.route("/update/:Id").put(async(req,res) =>{
    let itemId = req.params.Id;
    const {ID,Name} = req.body;

    const updateStock = {
        ID,
        Name
    }
    const update = await stock.findByIdAndUpdate(itemId, updateStock,{ new: true }).then( () => {
        res.status(200).send({status:"stock updated", item: update})
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "Error in updating", error: err.message});
    })   
})*/




router.route("/update/:id").put(async(req,res) =>{
    try{
    let itemId = req.params.id;
    const {ID, Name, Category, Quantity, Status} = req.body;

    const updateStock = {
        ID,
        Name,
        Category,
        Quantity,
        Status
    }
    const update = await stock.findByIdAndUpdate(itemId, updateStock,{ new: true });

    if (!update) {
        return res.status(404).json({ status: "Stock item not found" });
    }
        res.status(200).send({status:"stock updated", item: update});
    

    }catch(err){
        console.log(err);
        res.status(500).send({status: "Error in updating", error: err.message});
    }
    
    

})






router.route("/delete/:id").delete(async(req,res) => {
    let itemId = req.params.id;
    await stock.findByIdAndDelete(itemId).then(() => {
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
    const item = await stock.findById(itemId);

    if (!item) {
        return res.status(404).json({ message: "Stock item not found" });
    }
        res.status(200).send({status: "fetched" , data: item});
    }catch(err){
        console.log(err.message);
        res.status(500).send({status: "error in fetching", error: err.message});
    }
    
})

/*router.route("/get/:id").get(async(req,res) => {
    let itemId = req.params.id;
    //await stock.findOne(Name)
    const item = await stock.findById(itemId).then(() => {
        res.status(200).send({status: "fetched" , data: item})
    }).catch(() => {
        console.log(err.message);
        res.status(500).send({status: "error in fetching", error: err.message});
    })
    
})*/



module.exports = router;