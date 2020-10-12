const Post = require('../models/post');

exports.createPost=(req, res, next) =>{
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
        .catch(error=>{
            res.status(500).json({message:'Creating a post failed!'})
        });
}

exports.updatePost=(req, res, next)=>{
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
        .catch(error=>{
            res.status(500).json({message:'Updating a post failed!'})
        });
}

exports.getPosts=(req, res, next)=>{
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
        .catch(error=>{
            res.status(500).json({message:'Fetching posts failed!'})
        });
    
}

exports.getPost=(req, res, next)=>{
    Post.findById(req.params.id)
        .then(post=>{
            if(post){
                res.status(200).json(post)
            }else{
                res.status(404).json({message:"Post not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching post failed!'})
        });
}

exports.deletePost=(req, res, next)=>{
    Post.deleteOne({_id:req.params.id, creator: req.userData.userId})
        .then(result=>{
            console.log(result);
            if(result.n>0){
                res.status(200).json({message:"Post Deleted successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch(error=>{
            res.status(500).json({message:'Deleting the post failed!'})
        });
}