const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require("mongoose");

const Post = require('./models/post');

const app = express();

mogoose.connect("mongodb+srv://meanapp:AEKzArBnCBP1ehTH@cluster0.fgaaw.mongodb.net/meanapp", { useNewUrlParser: true, useUnifiedTopology: true })
        .then(()=>{console.log("Connected to Database")})
        .catch(()=>{console.log("Db connection failed!")});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Adding middleware to resolve CORS problem
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next()
});

app.post('/api/posts',(req, res, next) =>{
    const post=new Post({
        title: req.body.title,
        content: req.body.content
    });
    // console.log(post);
    post.save();
    res.status(201).json({message:"Post added successfully!"});
})

app.use('/api/posts',(req, res, next)=>{
    const posts=[{id:"asdf1adf",title:"title", content: "content"},{id:"asdf2adf",title:"title", content: "content"},{id:"asdf3adf", title:"title", content: "content"}];
    res.status(200).json({message:"Post fetched successfully", posts:posts});
});

module.exports = app;