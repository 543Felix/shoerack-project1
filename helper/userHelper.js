const user = require('../model/userModel')
const shortid = require('shortid') 
const jwt = require('jsonwebtoken')
require('dotenv').config()

const maxAge = 3*24*60*60*1000

const createToken= (id)=>{
   return jwt.sign({id},process.env.JWT_SECRET_KEY,{
        expiresIn: maxAge
    })
}

const bcrypt = require('bcrypt')

const verifyLogin= (data)=>{
  return new Promise((resolve,reject)=>{
    user.findOne({email:data.email})
    .then((userData)=>{
        if(userData){
            bcrypt.compare(data.password,userData.password)
            .then((passwordMatch)=>{
                if(passwordMatch){
                    if(userData.is_blocked){
                    resolve({error:'Your account is blocked'})
                    }else{
                        const token = createToken(userData.id)
                        resolve({token})
                    }
                }else{
                    resolve({error:"Email and password are incorrect"})
                }
            })
            .catch((error)=>{
                reject(error)
            })
        }else{
            resolve({error:"User is not found please check your email"})
        }
    })
    .catch((error)=>{
        resolve(error)
    })
  })  
}

const generateReferalCode =async ()=>{
   return shortid.generate()
}


module.exports ={
    verifyLogin,
    generateReferalCode
}