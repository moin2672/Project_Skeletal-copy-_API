const express =  require('express');
const multer = require('multer');

const Post = require('../models/post');
const checkAuth= require("../middleware/check-auth");

const router=express.Router();

const MIME_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("InValid MIME Type");
        if(isValid){
            error=null;
        }
        cb(null,"backend/images");
    },
    filename:(req, file, cb)=>{
        const name=file.originalname.toLowerCase().split(' ').join('-');
        const ext=MIME_TYPE_MAP[file.mimetype];
        cb(null, name+'-'+Date.now()+'.'+ext);
    }
});


router.post('',checkAuth,multer({storage:storage}).single("image"),(req, res, next) =>{
    const url=req.protocol+'://'+req.get("host");
    const post=new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath:url+"/images/"+req.file.filename,
        creator:req.userData.userId
    });
    post.save()
        .then(createdPost=>{
            res.status(201).json({
                message:"Post added successfully!!",
                post: {
                    ...createdPost,
                    id:createdPost._id
                }
            });
        })
        .catch(()=>{
            console.log("post NOT saved")
        });
})

router.put("/:id",checkAuth,multer({storage:storage}).single("image"),(req, res, next)=>{
    let imagePath=req.body.imagePath;
    if(req.file){
        const url=req.protocol+"://"+req.get("host");
        imagePath=url+"/images/"+req.file.filename
    }
    
    const post = new Post({
        _id:req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath:imagePath,
        creator:req.userData.userId
    })
    console.log(post)
    Post.updateOne({_id:req.params.id, creator: req.userData.userId}, post)
        .then(result=>{
            console.log(result)
            if(result.nModified>0){
                res.status(200).json({message:"Post updated successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })

        .catch(()=>{
            console.log("Post not updated")
        })
});

router.get('',(req, res, next)=>{
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const postQuery=Post.find();
    let fetchedPosts;
    if(pageSize && currentPage){
        postQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    postQuery
        .then(documents=>{
            fetchedPosts=documents;
            return Post.countDocuments(); //Use Collection.countDocuments or Collection.estimatedDocumentCount instead of count
        })
        .then(count=>{
            res.status(200).json({
                message:"Post fetched successfully", 
                posts:fetchedPosts,
                maxPosts:count
            });
        })
        .catch(()=>{console.log("Unable to get documents")});
    
});

router.get('/:id',(req, res, next)=>{
    Post.findById(req.params.id)
        .then(post=>{
            if(post){
                res.status(200).json(post)
            }else{
                res.status(404).json({message:"Post not found"});
            }
        })
        .catch(()=>{
            console.log("Found error in getting a post by ID")
        })
});

router.delete('/:id',checkAuth,(req, res, next)=>{
    Post.deleteOne({_id:req.params.id, creator: req.userData.userId})
        .then(result=>{
            console.log(result);
            if(result.n>0){
                res.status(200).json({message:"Post Deleted successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch(()=>{
            console.log("Post is not deleted")
        })
});

module.exports=router;