const jwt =require('jsonwebtoken')
const Admin = require('../model/adminModel')
require('dotenv').config()

const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwtAdmin

    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decodedToken)=>{
            if(err){
                res.redirect('/admin')
                //  console.error(err.message)
            }else{
                next()
            }
        })
    }else{
        //   console.error(error.message);
        res.redirect('/admin')
    }
}

const checkAdmin = (req,res,next)=>{
    const token = req.cookies.jwtAdmin
    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY,async(err,decodedToken)=>{
         if(err){
           res.locals.admin = null
           next()
         }else{
           const admin = await Admin.findById(decodedToken.id)
           res.locals.admin = admin
        next()
         }
        })
    }else{
        // console.error(error.message);
        res.locals.admin = null
        next()
    }
}

module.exports={
    requireAuth,
    checkAdmin
}