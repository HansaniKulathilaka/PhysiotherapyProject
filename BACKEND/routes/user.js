const router = require("express").Router();
let User = require("../models/User");




router.route("/add").post((req,res) => {
    const UserName = req.body.UserName;
    const Password = req.body.Password;
    const Email = req.body.Email;
    const Gender = req.body.Gender;
    const Age = req.body.Age;
    const Occupation = req.body.Occupation;
     const photo = req.body.photo;
     const Role = req.body.Role;

    const newUser = new User({
        UserName,
        Password,
        Email,
        Gender,
        Age,
        Occupation,
        photo,
        Role
    })

    newUser.save().then( () => {
        res.json("user added")
    }).catch( (err) => {
        console.log(err);
    })
})

router.route("/").get((req,res) => {
    User.find().then((stock) => {
        res.json(stock)
    }).catch((err) => {
        console.log(err)
    })
})

/*router.route("/login").post(async(req,res) =>{
    const {UserName,Password} = req.body;
    try{
        const user = await User.findOne({ UserName, Password });
        if(!user){
            return res.json("User not found")
        }
        if(user.Password === Password){
            return res.json("You are logged in")
        }
        else{
            return res.json("incorrect user name or password")
        }
    }catch(err){
        console.log(err)
    }
})*/

router.route("/login").post(async (req, res) => {
   const { UserName, Password ,Role} = req.body;

  try {
    const user = await User.findOne({ UserName });
    if (!user) return res.status(404).json("User not found");

    if (user.Password !== Password) {
      return res.status(401).json("Incorrect username or password");
    }

    if (/*user.Role !== Role*/user.Role && Role && user.Role !== Role ) {
      return res.status(401).json("You have entered wrong Role");
    }

    const userRole = user.Role || Role || "I am a patient";

    // Store user in session
    req.session.userId = user._id;
    req.session.userName = user.UserName;
    req.session.role = user.userRole;

    console.log("Session after login:", req.session);

    return res.json({ message: "You are logged in", userId: user._id, userName: user.UserName, gender: user.Gender ,age: user.Age ,occupation: user.Occupation,role: user.userRole});
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server error");
  }
});

/*router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json("Logged out");
});*/

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Logout failed" });
    }

    // Clear the cookie in the browser
    res.clearCookie("connect.sid", { path: "/" });

    console.log("User logged out successfully");
    return res.json({ message: "Logout successful" });
  });
});

module.exports = router;