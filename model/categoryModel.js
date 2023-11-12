const mongoose = require("mongoose")
const mongoosePaginate = require('mongoose-paginate');
const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    isListed:{
        type:Boolean,
        default:true
    },
    discountPercentage:{
        type:Number,
        default:0
    },discountValidity:{
        type: Date,
        default: new Date()
    }
})

categorySchema.plugin(mongoosePaginate);
const Category = mongoose.model('Category',categorySchema)
module.exports = Category