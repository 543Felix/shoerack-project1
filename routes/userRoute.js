const express = require('express');
const user_route = express();
const usercontroller = require('../controllers/userControllers');
const productController = require('../controllers/productController')
const wishListController = require('../controllers/wishListController')
const cartController = require('../controllers/cartController')
const validate = require('../middilewares/userAuth')
const Block = require('../middilewares/blockMiddileware')
const orderController = require('../controllers/orderController')
const profileController = require('../controllers/profileController')


user_route.set('views','./views/user')
user_route.all('*',validate.checkUser)

// user_route.get('/banner',usercontroller.banner)

user_route.get('/',usercontroller.userHomepage);
user_route.get('/login',usercontroller.userLogin)
user_route.post('/login',usercontroller.verifyLogin)
user_route.get('/registration',usercontroller.registration)
user_route.post('/registration',usercontroller.insertUser)
user_route.post('/verifyotp',usercontroller.verifyOtp)
user_route.get('/logout',usercontroller.logout)

//Forget password
user_route.get('/forgetPassword',usercontroller.forgetPassword)
user_route.post('/forgetPasswordOtp',usercontroller.forgetPasswordOtp)
user_route.post('/forgotPassword',usercontroller.resetPasswordOtpVerify)
user_route.post('/setNewPassword',usercontroller.setNewPassword)


// Product page
user_route.get('/shop',usercontroller.shopPage)
user_route.get('/categoryShop',usercontroller.categoryPage)
user_route.get('/product',productController.singleProduct)

//WishList
user_route.get('/wishlist',validate.requireAuth,Block.checkBlocked,wishListController.getWishList)
user_route.post('/addToWishlist',validate.requireAuth,Block.checkBlocked,wishListController.addToWhishlist)
user_route.delete('/remove-product-wishlist',validate.requireAuth,Block.checkBlocked,wishListController.removeWishList)

// Cart
user_route.post('/addToCart/:id',validate.requireAuth,Block.checkBlocked,cartController.addToCart)
user_route.get('/cart',validate.requireAuth,Block.checkBlocked,cartController.loadCart)
user_route.put( '/change-product-quantity',validate.requireAuth,Block.checkBlocked,cartController.updateQuantity)
user_route.delete("/delete-product-cart",validate.requireAuth,Block.checkBlocked,cartController.deleteProduct)

//checkOut
user_route.get('/checkOut',validate.requireAuth,Block.checkBlocked,orderController.checkOut)
user_route.post('/checkOut',validate.requireAuth,Block.checkBlocked,orderController.postCheckOut)
// coupon apply
user_route.get('/applyCoupon/:id',validate.requireAuth,Block.checkBlocked,orderController.applyCoupon)
user_route.get('/couponVerify/:id',validate.requireAuth,Block.checkBlocked,orderController.verifyCoupon)

//payement mode
user_route.post('/verifyPayment',validate.requireAuth,Block.checkBlocked,orderController.verifyPayment)
user_route.post('/paymentFailed',validate.requireAuth,Block.checkBlocked,orderController.paymentFailed)

//checkOutAddress
user_route.post('/checkOutAddress',validate.requireAuth,Block.checkBlocked,profileController.checkOutAddress)
user_route.post('/changeDefaultAddress',validate.requireAuth,Block.checkBlocked,orderController.changePrimaryAddress)

//Profile
user_route.get('/dashboard',validate.requireAuth,Block.checkBlocked,profileController.loadDashboard)
user_route.get('/profileOrderList',validate.requireAuth,Block.checkBlocked,orderController.orderList)
user_route.get('/orderDetails',validate.requireAuth,Block.checkBlocked,orderController.orderDetails)
user_route.put('/cancelOrder',validate.requireAuth,Block.checkBlocked,orderController.cancelOrder)
user_route.get('/profileAddress',validate.requireAuth,Block.checkBlocked,profileController.profileAdress)
user_route.post('/updateAddress',validate.requireAuth,Block.checkBlocked,profileController.editAddress)
user_route.get('/wallet',validate.requireAuth,Block.checkBlocked,profileController.walletTransaction)
user_route.get('/profileDetails',validate.requireAuth,Block.checkBlocked,profileController.profile)


//error

user_route.all('*',usercontroller.error404)
user_route.get('/error-403',usercontroller.error403)
user_route.get('/error-500',usercontroller.error500)

user_route.get('/invoice',validate.requireAuth,Block.checkBlocked,orderController.downloadInvoice)
module.exports = user_route ;