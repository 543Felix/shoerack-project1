

const mongoose = require('mongoose')
require("dotenv").config()

const connectDb = ()=>{
    mongoose.connect(process.env.Mongoose_String,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{
        console.log('connected to database')
    })


}



module.exports = { connectDb }

