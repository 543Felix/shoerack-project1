const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.String,
      ref: "User",
    },
    cartItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number,},
        total: { type: Number },
        discountedPrice:{type:Number,default:0}
      },
    ],
    cartTotal:{type:Number}
  });
  const Cart = mongoose.model('Cart', cartSchema)
  
  module.exports = Cart