const admin = require('../model/adminModel')
const jwt = require('jsonwebtoken')
const User = require ('../model/userModel')
const Order = require('../model/orderModel')
const Product = require('../model/productModel')
const Category = require('../model/categoryModel')
const orderHelper = require('../helper/orderHelper')
const adminHelper = require('../helper/adminHelper')
const maxAge = 3*24*60*60

const createToken = (id) => {
   return jwt.sign({id},process.env.JWT_SECRET_KEY,{
    expiresIn: maxAge
   })
  };
const adminRegistration=async(req,res,next)=>{
    try {
       res.render('adminRegistration') 
    } catch (error) {
       console.error(error); 
    }
}
 
const adminLogin = async(req,res,next)=>{
    try {
        if(res.locals.admin !==null && res.locals.admin !== 'undefined'){
          res.redirect('/admin/dashboard')
        }else{
            res.render('login')
        }
    } catch (error) {
        console.error(error);
    }
}

const adminHome = async(req,res)=>{
    try {
      res.render('adminHome')  
    } catch (error) {
       console.error(error.message); 
    }
} 

const verifyLogin = async (req,res)=>{
    try {
       const name = req.body.name
       const password = req.body.password
       const adminData = await admin.findOne({name:name})
       if(adminData){
         if(password===adminData.password){
            const token = createToken(adminData._id)
            res.cookie('jwtAdmin',token,{ httpOnly: true, maxAge: maxAge * 1000 })
            res.redirect('/admin/dashboard')
         }else{
            res.render('login',{message:'Please verify your password'})
         }
       }else{
        res.render('login',{message:'Please verify your name'})
       }
    } catch (error) {
        console.error(error.message);
    }
}
 
const blockUser = async(req,res)=>{
    try {
    const id = req.body.userId
    await User.findByIdAndUpdate({_id:id},{$set:{is_blocked:true}})
    res.send({status:true})
    } catch (error) {
      console.error(error.message);  
    }
}

const unBlockUser = async(req,res)=>{
    try {
      const id = req.body.userId
      await User.findByIdAndUpdate({_id:id},{$set:{is_blocked:false}}) 
      res.send({status:true}) 
    } catch (error) {
      console.error(error.message);  
    }
}
const loadUsers = async(req,res)=>{
    try{
        const userData = await User.find()
        res.render('userList',{user:userData})
    }catch (error){
        console.error(error.message);
    }
}

const logOut = async(req,res)=>{
    try {
        res.clearCookie('jwtAdmin')
       res.render('login') 
    } catch (error) {
        console.error(error.message);
    }
}

const orderList = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
  
    orderHelper
      .getOrderList(page, limit)
      .then(({ orders, totalPages, page: currentPage, limit: itemsPerPage }) => {
        res.render("orderList", {
          orders,
          totalPages,
          page: currentPage,
          limit: itemsPerPage,
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const orderDetails = async (req,res)=>{
    try {
      const id = req.query.id
       await adminHelper.findOrder(id).then((orders) => {
        const address = orders[0].shippingAddress
        const products = orders[0].productDetails 
        res.render('orderDetails',{orders,address,products}) 
      });
        
    } catch (error) {
      console.log(error.message);
    }
  
  }
  const changeStatus = async(req,res)=>{
    const orderId = req.body.orderId
    const status = req.body.status
    adminHelper.changeOrderStatus(orderId, status).then((response) => {
      res.json(response);
    });
  
  }

  const cancelOrder = async(req,res)=>{
    const userId = req.body.userId
  
    const orderId = req.body.orderId
    const status = req.body.status
  
    adminHelper.cancelOrder(orderId,userId,status).then((response) => {
      res.send(response);
    });
  
  }
  const returnOrder = async(req,res)=>{
    const orderId = req.body.orderId
    const status = req.body.status
    const userId = req.body.userId
  
  
    adminHelper.returnOrder(orderId,userId,status).then((response) => {
      res.send(response);
    });
  
  } 

  const loadDashboard = async(req,res)=>{
    try {
      const orders = await Order.aggregate([
        { $unwind: "$orders" },
        {
          $match: {
            "orders.orderStatus": "Delivered"  // Consider only completed orders
          }
        },
        {
          $group: {
            _id: null,
            totalPriceSum: { $sum: { $toInt: "$orders.totalPrice" } },
            count: { $sum: 1 }
          }
        }
  
      ])

      const salesData = await Order.aggregate([ 
        { $unwind: "$orders" },
        { $match: { "orders.orderStatus": "Delivered" } }, 
        
        {  
          $group: {
            _id: {
              $dateToString: {  // Group by the date part of createdAt field
                format: "%Y-%m-%d",
                date: "$orders.createdAt"
              }
            },
            dailySales: { $sum: { $toInt: "$orders.totalPrice" } }  // Calculate the daily sales
          } 
        }, 
        {
          $addFields: {
            date: { $toDate: "$_id" }
          }
        },
        {
          $group: {
              _id: {
                year: { $year: "$date" } ,  // Extract the year from the date
                month: { $month: "$date" },  // Extract the month from the date
                day:{ $dayOfMonth : "$date"}
              },
            monthlySales: { $sum: "$dailySales" },  // Calculate the monthly sales
            yearlySales: { $sum: "$dailySales" }   // Calculate the yearly sales
          }
        },
        {
          $sort: {
            "_id.year": 1,  // Sort the results by year in ascending order
            "_id.month": 1,  // Then, sort by month in ascending order
            "_id.day":1
          }
        }
      ])
      
      const categorySales = await Order.aggregate([
        { $unwind: "$orders" },
        { $unwind: "$orders.productDetails" },
        {
          $match: {
            "orders.orderStatus": "Delivered",
          },
        },
        {
          $project: {
            CategoryId: "$orders.productDetails.category",
            totalPrice: {
              $multiply: [
                { $toDouble: "$orders.productDetails.productPrice" },
                { $toDouble: "$orders.productDetails.quantity" },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$CategoryId",
            PriceSum: { $sum: "$totalPrice" },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        {
          $unwind: "$categoryDetails",
        },
        {
          $project: {
            categoryName: "$categoryDetails.categoryName",
            PriceSum: 1,
            _id: 0,
          },
        },
      ]);
      const salesCount = await Order.aggregate([
        { $unwind: "$orders" },
        {
          $match: {
            "orders.orderStatus": "Delivered"  
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {  // Group by the date part of createdAt field
                format: "%Y-%m-%d",
                date: "$orders.createdAt"
              }
            },
            orderCount: { $sum: 1 }  // Calculate the count of orders per date
          }
        },
        {
          $sort: {
            _id: 1  // Sort the results by date in ascending order
          }
        }
      ])

      const categoryCount  = await Category.find({}).count()

    const productsCount  = await Product.find({}).count()
    const onlinePay = await adminHelper.getOnlineCount()
    const walletPay = await adminHelper.getWalletCount()
    const codPay = await adminHelper.getCodCount()
    const latestorders = await Order.aggregate([
      {$unwind:"$orders"},
      {$sort:{
        'orders.createdAt' :-1
      }},
      {$limit:10}
    ])

    res.render('dashboard',{orders,productsCount,categoryCount,
      onlinePay,salesData,order:latestorders,salesCount,
      walletPay,codPay,categorySales})
    } catch (error) {
      console.error(error.message);
    }
  }


  const getSalesReport =  async (req, res) => {
    const report = await adminHelper.getSalesReport();
    let details = [];
    const getDate = (date) => {
      const orderDate = new Date(date);
      const day = orderDate.getDate();
      const month = orderDate.getMonth() + 1;
      const year = orderDate.getFullYear();
      return `${isNaN(day) ? "00" : day} - ${isNaN(month) ? "00" : month} - ${
        isNaN(year) ? "0000" : year
      }`;
    };
  
    report.forEach((orders) => {
      details.push(orders.orders);
    });
  
    res.render('salesReport',{details,getDate})
  
    
  }

  const postSalesReport =  (req, res) => {
    let details = [];
    const getDate = (date) => {
      const orderDate = new Date(date);
      const day = orderDate.getDate();
      const month = orderDate.getMonth() + 1;
      const year = orderDate.getFullYear();
      return `${isNaN(day) ? "00" : day} - ${isNaN(month) ? "00" : month} - ${
        isNaN(year) ? "0000" : year
      }`;
    };
  
    adminHelper.postReport(req.body).then((orderData) => {
      orderData.forEach((orders) => {
        details.push(orders.orders);
      });
      res.render("salesReport", {details,getDate});
    });
  }
module.exports={
    adminRegistration,
    adminLogin,
    adminHome,
    verifyLogin,
    loadUsers,
    blockUser,
    unBlockUser,
    logOut,
    orderList,
    orderDetails,
    changeStatus,
    cancelOrder,
    returnOrder,
    loadDashboard,
    getSalesReport,
    postSalesReport
}