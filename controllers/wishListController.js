

const wishListHelper = require('../helper/wishListHelper')


const getWishList = async (req, res) => {
    let user = res.locals.user;
    // let count = await cartHelper.getCartCount(user._id);
    const wishlistCount = await wishListHelper.getWishListCount(user._id);
    wishListHelper.getWishListProducts(user._id).then((wishlistProducts) => {

      res.render("wishList", {
        user,
        // count,
        wishlistProducts,
        wishlistCount,
      });
    });
  }
const addToWhishlist = async(req,res)=>{
    const prodId = req.body.proId
    const userId = res.locals.user._id
        wishListHelper.addToWhishlist(userId,prodId).then((response)=>{
            res.send(response)
        }) 
    

}

const removeWishList = async(req,res)=>{
  const prodId = req.body.proId
  const userId = res.locals.user._id
  await wishListHelper.removeWishList(userId,prodId)
  .then((response)=>{
    res.send(response)
  })

  
}

module.exports={
    addToWhishlist,
    getWishList,
    removeWishList
}

