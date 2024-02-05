const mongoose = require('mongoose');

const Post = new mongoose.Schema({
    name:{type:String,require:true},
    prompt:{type:String,require:true},
    photo:{type:String,require:true},
})

module.exports = mongoose.model('Post',Post)

