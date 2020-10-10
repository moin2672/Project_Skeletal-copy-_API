const path=require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require("mongoose");

const postRoutes = require("./routes/posts");

const app = express();

mogoose.connect("mongodb+srv://meanapp:AEKzArBnCBP1ehTH@cluster0.fgaaw.mongodb.net/meanapp", { useNewUrlParser: true, useUnifiedTopology: true })
        .then(()=>{console.log("Connected to Database")})
        .catch(()=>{console.log("Db connection failed!")});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images",express.static(path.join("backend/images")))

//Adding middleware to resolve CORS problem
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next()
});

app.use("/api/posts",postRoutes);

module.exports = app;