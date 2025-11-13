const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const session = require("express-session");
//const multer = require("multer");
//3
//const {GoogleGenerativeAI} = requie("@google/generative-ai");
require("dotenv").config();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",  // your frontend URL
  credentials: true
}));

app.use(session({
  secret: "super-secret-key",   // change in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,   // set true only if using HTTPS
    maxAge: 1000 * 60 * 60, // 1 hour
    sameSite: "lax"  // works for localhost
  }
}));


const PORT = process.env.PORT || 8080 ;

//app.use(cors());
app.use(bodyParser.json());
app.use("/files",express.static("files"));

const URL = process.env.MONGODB_URL;

mongoose.connect(URL)
  .then(() => {
    console.log("MongoDB connection is successful!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const connection = mongoose.connection;
connection.once("open" , ()  => {
    console.log("mongo DB connection is successful! ");
})

/*const stockRouter = require("./routes/Stock.js");
app.use("/stock",stockRouter);*/

const userRouter = require("./routes/user.js");
app.use("/user",userRouter);

/*const ChatRouter = require("./routes/Chat.js");
app.use("/chat",ChatRouter);*/

const fileRouter = require("./routes/Files.js");
app.use("/files",fileRouter);

const mediQRouter = require("./routes/MediQ.js");
app.use("/mediQ",mediQRouter);

const mediDataRouter = require("./routes/MediData.js");
app.use("/mediData",mediDataRouter);

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`)
})