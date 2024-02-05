const express = require("express")
require('dotenv').config();
const cloudinary = require("cloudinary").v2;
const Post = require("../mongodb/models/post")

const router = express.Router();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

//get all posts
router.route('/').get(async(req,res)=>{
    try {
        const posts = await Post.find({});
        res.status(200).json({success:true,data:posts}) 
    } catch (error) {
        res.status(500).json({success:false,message:error})
    }
})

router.route('/').post(async(req,res)=>{
    try {
    const {name,prompt,photo} = req.body.form
    const photoUrl = await cloudinary.uploader.upload(photo)

    const newPost = await Post.create({
        name,
        prompt,
        photo:photoUrl.secure_url
    })
    res.status(201).json({success:true,data:newPost}) ;
    } catch (error) {
        res.status(500).json({success:false,message:error})
    }  
})

module.exports = router;