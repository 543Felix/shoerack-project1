const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require('./config/mongoDb');
const path = require('path');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');

const app = express();

// Database connection
config.connectDb();

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

// Middleware
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', 
    resave: false,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', userRoute);
app.use('/admin', adminRoute);

// Start server
app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});
