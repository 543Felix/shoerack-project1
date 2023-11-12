const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    price:{
      type:Number,
      required:true
    },
    discountPercentage:{
      type:Number,
      default:0
  },discountValidity:{
      type: Date,
      default: new Date()
  },
  discountedPrice:{
    type:Number,
    default:0
  },
    isCategoryListed:{
      type:Boolean,
      default:true
    },
    isProductListed:{
      type:Boolean,
      default:true
    },
    stock:{
      type:Number
    }
  });
  const Product = mongoose.model('Product',productSchema)
  
  module.exports = Product