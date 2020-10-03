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
    post.save()
        .then(createdPost=>{
            res.status(201).json({
                message:"Post added successfully!",
                postId: createdPost._id
            });
        })
        .catch(()=>{
            console.log("post NOT saved")
        });
})

app.get('/api/posts',(req, res, next)=>{
    Post.find()
        .then(documents=>{
            res.status(200).json({
                message:"Post fetched successfully", 
                posts:documents
            });
        })
        .catch(()=>{console.log("Unable to get documents")});
    
});

app.delete('/api/posts/:id',(req, res, next)=>{
    Post.deleteOne({_id:req.params.id})
        .then(result=>{
            console.log(result);
            res.status(200).json({message:"Post Deleted!"})
        })
        .catch(()=>{
            console.log("Post is not deleted")
        })
});

module.exports = app;