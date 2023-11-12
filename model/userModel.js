const mongoose = require("mongoose")
//jwt if needed
const userSchema  = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
    },
    mobile:{
        type: Number,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    referalCode:{
        type:String
    },
    is_blocked:{
        type:Number,
        required:true,
        default:false
    },                          
    wallet:{
        type:Number,
        default:0
    },
    walletTransaction:{
        type:Array
    },
    coupons:{
        type:Array,
    }
})


const User = mongoose.model('User',userSchema)
module.exports =User