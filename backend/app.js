const express = require('express');

const app = express();

//middleware
// app.use((req, res, next)=>{
//     console.log('First Middleware')
//     next()
// });

app.use('/api/posts',(req, res, next)=>{
    const posts=[{title:"title", content: "content"},{title:"title", content: "content"},{title:"title", content: "content"}];
    res.status(200).json({message:"Post fetched successfully", posts:posts});
});

module.exports = app;