const wishList = require('../model/wishlistModel')
const products = require('../model/productModel')
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Types

     
const getWishListCount = async (userId) => {
    try {
      return new Promise((resolve, reject) => {
        let count = 0;
        wishList.findOne({ user: userId }).then(
          (userWishlist) => {
            if (userWishlist) {
              count = userWishlist.length;
            }
            resolve(count);
          }
        );
      });
    } catch (error) {
      console.log(error.message);
    }
  }

//to get wishlist
const getWishListProducts = async (userId) => {
    try {
      return new Promise((resolve, reject) => {
        wishList.aggregate([
          {
            $match: {
              user: new ObjectId(userId),
            },
          },
          {
            $unwind: "$wishList",
           },
          {
            $project: {
              productId: "$wishList.productId",
              createdAt: "$wishList.createdAt",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "wishListed",
            },
          },{
            $project: {
              productId: 1,
              createdAt: 1,
              wishListed: { $arrayElemAt: ["$wishListed", 0] },
            },
          }
          
        ]).then((wishListed) => {
          resolve(wishListed);
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  }
    const  addToWhishlist = async(userId, proId) => {
        try {
          return new Promise((resolve, reject) => {
            wishList.findOne({ user: new ObjectId(userId) }).then(
              (userWishList) => {
                if (userWishList) {

                  let productExist = userWishList.wishList.findIndex(
                    (wishList) => wishList.productId == proId
                  );
                  if (productExist != -1) {
                    resolve({ status: false });
                  } else {
                    wishList.updateOne(
                      { user: new ObjectId(userId) },
                      {
                        $push: {
                          wishList: { productId: new ObjectId(proId) },
                        },
                      }
                    ).then(() => {
                        
                      resolve({ status: true });
                    });
                  }
                } else {
                  let wishListData = new wishList({
                    user: new ObjectId(userId),
                    wishList: [{ productId: new ObjectId(proId) }],
                  });
                  wishListData
                    .save()
                    .then(() => {
                      resolve({ status: true });
                    })
                    .catch((err) => {
                      reject(err);
                    });
                }
              }
            );
          });
        } catch (error) {
          console.log(error.message);
        }
      }

      const removeWishList = async(userId,prodId)=>{
        try {
          return new Promise((resolve,reject)=>{
            wishList.findOneAndUpdate(
              {user: userId},
              {
                $pull:{
                  wishList:{productId: prodId }
                }
              }
            ).then((response)=>{
              resolve(response)
            })
          })
        }
         catch (error) {
          console.error(error.message);
        }
      }

module.exports={
    addToWhishlist,
    getWishListCount,
    getWishListProducts,
    removeWishList

}