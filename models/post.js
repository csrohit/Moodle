const mongoose = require('mongoose');

let postSchema = new mongoose.Schema({
    title:{
        type:String,
        required : true
    },
    desc:{
        type:String,
        required : true
    },
    author_id:{
        type:String ,
        required : true 
    },
    author_rank:{
        type:Number,
        required : true 
    },
    subject_id:{
        type:Number ,
        required : true 
    },
    branch:{
        type:Number ,
        required : true 
    },
    year:{
        type:Number,
        required : true
    },
    comments: [{
        author_id: {
            type: String
        },
        author_name:{
            type:String,
            required:true
        },
        txt: {
            type: String
        },
        date: {
            type: Date,
            default: Date()
        }
    }],
    date: {
        type: Date,
        default: Date()
    }
});
const Post = module.exports = mongoose.model('post',postSchema);

module.exports.create = (newPost)=>{
    return new Promise((resolve,reject)=>{
        newPost.save((err,post)=>{
            if(err) reject("Failed to create post : " + err);
            resolve(post);
        })
    });
}
module.exports.fetchPosts = ()=>{
    return new Promise((resolve,reject)=>{
        Post.find({},(err,posts)=>{
            if(err) reject("Failed to fetch posts \n" + err);
            else resolve(posts);
        })
    });
}
module.exports.fetchComments = (post_id)=>{
    return new Promise((resolve,reject)=>{
        Post.findById(post_id, (err, post) => {
            if (err) reject("Unable to find Comments \n" + err);
            else resolve(post.comments);
        })
    })
}
module.exports.addComment =  (id,newComment)=>{
    console.log(newComment);
    return new Promise((resolve,reject)=>{
        Post.update({_id : id},{$push:{'comments':newComment}},(err,result)=>{
            if(err) reject("Failed to add comment : \n" + err);
            else resolve(result);
        })

    })
} 