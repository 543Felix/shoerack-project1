const User = require('../model/userModel')
const Product =require('../model/productModel')
const Category = require('../model/categoryModel')
const bcrypt = require('bcrypt')
const express = require('express')
const jwt = require('jsonwebtoken')
const otpHelper = require('../helper/otpHelper')
const userHelper = require('../helper/userHelper')
const productHelper = require('../helper/productHelper')
require('dotenv').config()
const Banner = require('../model/bannerModel')

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge
  });
};


const user_controller = express.Router()
user_controller.use(express.json())

// const banner = async (req,res)=>{
//     try {
//         const banner = await Banner.find({})
//         console.log("banner",banner[0].image);
//        res.render('banner',{banner}) 
//     } catch (error) {
//         console.error(error.message);
//     }
// }

const errorPage = async(req,res)=>{
  try {
   res.render('error-404') 
  } catch (error) {
    console.error(error.message);
  }
}
const userHomepage = async(req, res, next) => {
    try { 
        const banner = await Banner.find({})
        res.render('homepage',{banner})
    } catch (error) {
       console.error(error.message);
    }
};

const userLogin=async(req,res,next)=>{
    try {
        if(res.locals.user !==null){
            res.redirect('/')
        }else{
            res.render('login')
        } 
    } catch (error) {
       console.error(error.message); 
    }
}
const registration=async(req,res,next)=>{
try {
    if(res.locals.user !== null){
        res.redirect('/')
    }else{
        res.render('registration')
    }
} catch (error) {
    console.error(error.message);
}
}

    
const securePassword =  async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10)
            return passwordHash
    } catch (error) {
        console.error(error.message);
    }
}
const insertUser = async(req,res)=>{
    const email = req.body.email;
    const mobileNumber = req.body.mobile
    const existingUser = await User.findOne({email:email})

    if(existingUser){
      return res.render("registration",{message:"Email already exists"})
    }

    if(req.body.password!==req.body.confirmpassword){
        return res.render("registration", { message: "Password and Confirm Password must be same" });
    }

    await otpHelper.sendOtp(mobileNumber)
    try {
        req.session.userData = req.body;
        req.session.mobile = mobileNumber 
        req.session.referalCode = req.query.referalCode
        res.render('verifyotp')
    } catch (error) {
        console.log(error.message);
       
 
    }
}

const verifyOtp = async(req,res)=>{
     const otp = req.body.otp
    try {
    const userData = req.session.userData;
     const verified = await otpHelper.verifyCode(userData.mobile,otp)

    if(verified){
    const spassword =await securePassword(userData.password)
    const referalCode = await userHelper.generateReferalCode()
    console.log("referalcode afterOtp verify:",userData.referralcode);
    const userReferedCode = req.session.referalCode|| userData.referralcode
    const userRefered = await User.findOne({referalCode:userReferedCode})
    console.log(userRefered);
    let user
    if(userRefered !== null){
        const walletTransaction = {
            date:new Date(),
            type:"Credit",
            amount:50,

          }
        await User.findOneAndUpdate({referalCode:userReferedCode},
            {
                $inc:{wallet:50},
                $push: { walletTransaction: walletTransaction }
        })
         user = new User({
            firstname:userData.firstName,
            lastname:userData.lastName,
            email:userData.email,
            mobile:userData.mobile,
            password:spassword,
            referalCode:referalCode,
            wallet:20
        }) 
    }else{
         user = new User({
            firstname:userData.firstName,
            lastname:userData.lastName,
            email:userData.email,
            mobile:userData.mobile,
            password:spassword,
            referalCode:referalCode
        })
    }
        const userDataSave = await user.save()
        if(userDataSave){
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.redirect('/')
        }else{
            res.render('registration',{message:"Registration Failed"})
        }
      }else{
        res.render('verifyotp',{ message: 'Wrong Otp' });

      }


    } catch (error) {
        console.log(error.message);
     
    }
}
const verifyLogin = async(req,res)=>{
   const data = req.body
   const result = await userHelper.verifyLogin(data)
   if(result.error){
    res.render('login',{message:"Email and password are incorrect"})
   }else{
    const token = result.token;
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.redirect('/');
   }
}

const logout = (req,res)=>{
    try {
        res.clearCookie('jwt')
        res.redirect('/login')
    } catch (error) {
        console.error(error.message);
    }
}
const forgetPassword = async(req,res)=>{
    try {
      res.render('forgetPassword')  
    } catch (error) {
      console.error(error.message);  
    }
}

const forgetPasswordOtp = async(req,res)=>{
    try {
       const user = await User.find({email :req.body.email})
       const mobile = user[0].mobile
        if(mobile == req.body.mobile){
            if(!user){
                res.render('forgetPassword',{message:"User Not Registered"})
               }else{
                await otpHelper.sendOtp(mobile)
                req.session.email = user[0].email
                req.session.mobile = mobile
                res.render("forgetPasswordOtp")
               }
        }
       
    } catch (error) {
        console.error(error.message);
    }
}
  
const resetPasswordOtpVerify = async (req,res)  => {
    try{
        const mobile = req.session.mobile
        const reqOtp = req.body.otp
        const verified = await otpHelper.verifyCode(mobile,reqOtp)
        const otpHolder = await User.find({ mobile : req.body.mobile })
        if(verified){
            res.render('resetPassword')
        }
        else{
            res.render('forgotPassword',{message:"Your OTP was Wrong"})
        }
    }catch(error){
        console.log(error);
    }
}

const setNewPassword = async (req ,res) => {
    const newpw = req.body.newpassword
    const confpw = req.body.confpassword

    const mobile = req.session.mobile
    const email = req.session.email

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if(!passwordRegex.test(req.body.newpassword)){
        return res.render("resetPassword", { message: "Password Should Contain atleast 8 characters,one number and a special character" });
    }

    if(newpw === confpw){
        const user = await User.findOne({email:email})
        const spassword =await securePassword(newpw)
        const newUser = await User.updateOne({ email:email }, { $set: { password: spassword } });

        res.redirect('/login')
    }else{
        res.render('resetPassword',{message:'Password and Confirm Password is not matching'})
    }
}
const shopPage = async(req,res)=>{
    try {
        const searchQuery = req.query.search || '';
        const category = await Category.find({});
        const minPrice = parseFloat(req.query.minPrice);
        const maxPrice = parseFloat(req.query.maxPrice);
        const sortQuery = req.query.sort || 'default';
    
        let sortOption = {};
        if (sortQuery === 'price_asc' || sortQuery === 'default') {
            sortOption = { price: 1 };
        } else {
            sortOption = { price: -1 };
        }
    
        const searchFilter = {
            isCategoryListed: true,
            isProductListed: true,
            productName: { $regex: new RegExp(searchQuery, 'i') }
        };
    
        
    let products
         products = await Product.find(searchFilter).populate('category');
        //  await productHelper.updateProductPage(products)
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        products = products.filter(product => {
                const price = product.discountedPrice > 0 ? product.discountedPrice : product.price;
                return price >= minPrice && price < maxPrice;
            });
           
        }
       
        products.sort((a, b) => {
            const aPrice = a.discountedPrice > 0 ? a.discountedPrice : a.price;
            const bPrice = b.discountedPrice > 0 ? b.discountedPrice : b.price;
            return sortOption.price === 1 ? aPrice - bPrice : bPrice - aPrice;
        });
    
        res.render('shop', { product: products, category });
    } catch (error) {
        console.error(error.message);
    }
    
    
}
    
const categoryPage = async(req,res)=>{
    try {
       const categoryId = req.query.id
       const category = await Category.find({})
       const totalProducts = await Product.countDocuments({ category:categoryId,$and: [{ isListed: true }, { isProductListed: true }]}); // Get the total number of products
        
       const sortQuery = req.query.sort||'default'
       let sortOption={}
       if(sortQuery ==='price_asc'|| sortQuery ==='default') {
        sortOption = {price:1}
       }else{
         sortOption ={price :-1}
       }
       const product = await Product.find({category:categoryId,$and:[{isCategoryListed:true},{isProductListed:true}]})
       .populate('category')
       product.sort((a, b) => {
        const aPrice = a.discountedPrice > 0 ? a.discountedPrice : a.price;
        const bPrice = b.discountedPrice > 0 ? b.discountedPrice : b.price;

        return sortOption.price === 1 ? aPrice - bPrice : bPrice - aPrice;
    });
       res.render('categoryShop',{product,category,categoryId})
    } catch (error) {
      console.error(error.message);  
    }
}
module.exports = {
    userHomepage,
    userLogin,
    registration,
    insertUser,
    verifyOtp,
    verifyLogin,
    logout,
    forgetPassword,
    forgetPasswordOtp,
    resetPasswordOtpVerify,
    setNewPassword,
    shopPage,
    categoryPage,
    errorPage
};
     