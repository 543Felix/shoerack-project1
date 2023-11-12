const Cart = require('../model/cartModel')
const product = require('../model/productModel')
const wishList = require('../model/wishlistModel')
const cartHelper = require('../helper/cartHelper')

const addToCart = (req,res)=>{
    cartHelper.addToCart(req.params.id,res.locals.user._id).then((response)=>{
        res.send(response)
    })
}

const loadCart = async (req,res)=>{
    try {
        const user = res.locals.user
        const count = await cartHelper.getCartCount(user.id)
        let cartTotal =0
        const total = await Cart.findOne({user:user.id})
        if(total){
            cartTotal = total.cartTotal
            const cart = await Cart.aggregate([
                {
                    $match :{user :user.id}
                },
                {
                    $unwind :"$cartItems"
                },
                {
                    $lookup :{
                        from :"products",
                        localField:"cartItems.productId",
                        foreignField:"_id",
                        as:"carted"
                    }
                },
                {
                    $project:{
                        item:"$cartItems.productId",
                        quantity:"$cartItems.quantity",
                        total:"$cartItems.total",
                        discountedPrice:"$cartItems.discountedPrice",
                        carted:{ $arrayElemAt: ["$carted", 0] }
                    }
                }
    
            ])
            res.render('cart',{ cart, user, count, cartTotal })
        }else{
            res.render("cart", { user, count, cartTotal, cart: [] })
        }  
    } catch (error) {
      console.error(error.message);  
    }
    
}
 
const updateQuantity = async(req,res)=>{
    cartHelper.updateQuantity(req.body).then((response)=>{
        res.json(response)
    })
}

const deleteProduct = async(req,res)=>{
   cartHelper.deleteProduct(req.body).then((response)=>{
    res.send(response)
   })
}
module.exports ={
    addToCart,
    loadCart,
    updateQuantity,
    deleteProduct
}