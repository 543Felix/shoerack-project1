const jwt = require('jsonwebtoken')
const user = require('../model/userModel')
require('dotenv').config()

const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decodedToken)=>{
            if(err){
                res.redirect('/login')
            }else{
                next()
            }
        })
    } else{
        res.redirect('/login')
    }
}



const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY, async (err,decodedToken)=>{
           if(err){
            res.locals.user = null
             next()
           } else{
            const User = await user.findById(decodedToken.id)
            res.locals.user = User
            next()
           }
        })
    }else{
        res.locals.user = null
        next()
    }
}
module.exports={
    requireAuth,
    checkUser
}