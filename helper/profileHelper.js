const Address = require('../model/addressModel')

const updateAddress = async(userId,newAddress)=>{
   const updatedUser = await Address.findOneAndUpdate(
    {user:userId},
    {$push:{addresses:newAddress}},
    {new :true}
   )
   return updatedUser
}

const createAddress = async(userId,newAddress)=>{
    const userAddress= new Address({
        user:userId,
        adresses:[newAddress]
    })
    await userAddress.save()
}
module.exports ={
    updateAddress,
    createAddress
}