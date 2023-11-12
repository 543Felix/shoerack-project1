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
user_route.delete('/remove-product-wishlist',wishListController.removeWishList)

// Cart
user_route.post('/addToCart/:id',validate.requireAuth,Block.checkBlocked,cartController.addToCart)
user_route.get('/cart',validate.requireAuth,Block.checkBlocked,cartController.loadCart)
user_route.put( '/change-product-quantity',cartController.updateQuantity)
user_route.delete("/delete-product-cart",cartController.deleteProduct)

//checkOut
user_route.get('/checkOut',orderController.checkOut)
user_route.post('/checkOut',orderController.postCheckOut)
// coupon apply
user_route.get('/applyCoupon/:id',orderController.applyCoupon)
user_route.get('/couponVerify/:id',orderController.verifyCoupon)

//payement mode
user_route.post('/verifyPayment',orderController.verifyPayment)
user_route.post('/paymentFailed',orderController.paymentFailed)

//checkOutAddress
user_route.post('/checkOutAddress',profileController.checkOutAddress)
user_route.post('/changeDefaultAddress',orderController.changePrimaryAddress)

//Profile
user_route.get('/dashboard',validate.requireAuth,Block.checkBlocked,profileController.loadDashboard)
user_route.get('/profileOrderList',validate.requireAuth,Block.checkBlocked,orderController.orderList)
user_route.get('/orderDetails',orderController.orderDetails)
user_route.put('/cancelOrder',orderController.cancelOrder)
user_route.get('/profileAddress',validate.requireAuth,Block.checkBlocked,profileController.profileAdress)
user_route.post('/updateAddress',profileController.editAddress)
user_route.get('/wallet',profileController.walletTransaction)
user_route.get('/profileDetails',profileController.profile)


user_route.get('/invoice',orderController.downloadInvoice)
module.exports = user_route ;