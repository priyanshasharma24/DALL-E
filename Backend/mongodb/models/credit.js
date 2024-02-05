const mongoose = require('mongoose');

const Credit = new mongoose.Schema({
    creditLeft:{type:Number,require:true}
})

module.exports = mongoose.model('Credit',Credit)

