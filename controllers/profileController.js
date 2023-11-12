const Address = require('../model/addressModel')
const profileHelper = require('../helper/profileHelper')
const User = require('../model/userModel')
const loadDashboard = async (req,res)=>{
    try {
      res.render('dashboard')  
    } catch (error) {
        
    }
}

const checkOutAddress = async(req,res)=>{
    try {
        const userId = res.locals.user._id
    const name = req.body.name
    const mobileNumber = req.body.mno
    const address = req.body.address
    const city = req.body.city
    const locality = req.body.locality
    const pincode = req.body.pincode;
    const state = req.body.state;

    const newAddress ={
      name:name,
      mobileNumber:mobileNumber,
      address : address,
      city : city,
      locality:locality,
      pincode:pincode,
      state:state
    }
    const updatedUser = await profileHelper.updateAddress(userId,newAddress)
    if(!updatedUser){
      await profileHelper.createAddress(userId,newAddress)
    }
    res.redirect('/checkOut')
    } catch (error) {
       console.error(error.message); 
    }
    
}

const profile = async (req, res) => {
  try {
    let arr = []
    const user = res.locals.user;
    res.render("profileDetails", { user, arr });
  } catch (error) {
    console.log(error.message);
    res.redirect('/error-500')
  }
};
const profileAdress = async (req, res) => {
    try {
      let arr = []
      const user = res.locals.user;
      const address = await Address.find({user:user._id.toString()});
      if(address){
        const ad = address.forEach((x) => {
          return (arr = x.addresses);
        });
        res.render("profileAddress", { user, arr });
      }
      
    } catch (error) {
      console.log(error.message);
    }
  };

  const editAddress = async(req,res)=>{
    const id = req.body.id
    const name = req.body.name
    const mobileNumber = req.body.mobileNumber
    const address = req.body.address
    const locality = req.body.locality
    const city = req.body.city
    const pincode = req.body.pincode
    const state = req.body.state
    const updateAddress = await Address.updateOne(
      {"addresses._id":id},
      {
        $set:{
          "addresses.$.name":name,
          "addresses.$.mobileNumber":mobileNumber,
          "addresses.$.address":address,
          "addresses.$.locality":locality,
          "addresses.$.city":city,
          "addresses.$.pincode":pincode,
          "addresses.$.state":state

        }
      }
    ) 
  }

  const walletTransaction = async(req,res)=>{
    try {
      const user = res.locals.user
      // const userData= await User.findOne({_id:user._id})
      const wallet = await User.aggregate([
        {$match:{_id:user._id}},
        {$unwind:"$walletTransaction"},
        {$sort:{"walletTransaction.date":-1}},
        {$project:{walletTransaction:1,wallet:1}}
      ])
  
      res.render('walletTransaction',{wallet})
      
    } catch (error) {
      console.log(error.message);
    }
  
  
  }
module.exports ={
    checkOutAddress,
    loadDashboard,
    profileAdress,
    editAddress,
    walletTransaction,
    profile
}