const express = require('express')
const cookieParser = require('cookie-parser') 
const session = require('express-session')
const config = require('./config/mongoDb')
const ejs = require('ejs')
const app = express()
const path = require('path')




config.connectDb()





 app.set('view engine','ejs')
app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())
const userRoute = require('./routes/userRoute')
app.use('/',userRoute)
const adminRoute=require('./routes/adminRoute')
app.use('/admin',adminRoute)



app.listen(3001,()=>{
    console.log("server is running on the url http://localhost:3001");
})