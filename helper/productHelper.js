const Product = require('../model/productModel')
const Category = require('../model/categoryModel')
const path = require('path')
const fs = require('fs')

const createProduct = (data,images) => {
  
    return new Promise((resolve,reject) =>{
      const newProduct = new Product({
        productName:data.name,
        description:data.description,
        images:images,
        category:data.category,
        price:data.price,
        stock:data.stock
      });
  
      newProduct.save()
        .then(() =>{ 
          resolve() 
        })
        .catch((err) => {
          console.error('Error adding product:', err);
          reject(err)
        });
      });
  
  };

  const updateProduct = async (data, images,id) => {
    try {
        await Product.findByIdAndUpdate(
          { _id: id},
          {
            $set: {
              productName: data.name,
              description: data.description,
              category: data.category,
              images: images,
              stock:data.stock,
              price: data.price
            }
          }
        );
        // return productData.save()
    } catch (error) {
      console.log(error.message);
    }
  }; 
  const unListProduct = (query) => {
    return new Promise((resolve, reject) => {
      const id = query;
      Product.updateOne({ _id: id }, { isProductListed: false })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.log(error.message);
          reject(error);
        });
    });
  };
  

  const reListProduct = (Id) => {
    return new Promise(async (resolve, reject) => {
      try {
         await Product.findOneAndUpdate({ _id: Id },{$set:{ isProductListed: true }})   
        resolve();
      } catch (error) {
        console.log(error.message);
        reject(error);
      }
    });
  };

//   const updateProductPage = async(products)=>{
//     const currentDate = new Date()
//          products.forEach(async (product)=>{
//             productDiscountedPrice = (product.discountPercentage*product.price)/100
//             categoryDiscountedPrice = (product.category.discountPercentage*product.price)/100
//             const id = product._id
//             const categoryId = product.category._id
//             if(product.discountValidity !==null &&product.category.discountValidity !==null ){
//               if(product.discountValidity<= currentDate&& product.category.discountValidity <= currentDate){
//                 try {
//                   await Product.findOneAndUpdate({_id:id},
//                     {$set:{
//                       discountValidity:null,
//                       discountPercentage:0,
//                       discountedPrice:0
//                     }})
//                     await Category.findOneAndUpdate({_id:categoryId},
//                       {$set:{
//                         discountValidity:null,
//                         discountPercentage:0
//                       }
//                     })
//                 } catch (error) {
//                   console.error(error.message);
//                 }
//             }
//             }else if(product.discountValidity !==null ){
//               if(product.discountValidity<= currentDate){
//                 await Product.findOneAndUpdate({_id:id},
//                   {$set:{
//                     discountValidity:null,
//                     discountPercentage:0
//                   },
//                   $inc:{discountedPrice: productDiscountedPrice} 
//                 }
//                 )
//               }
//             }else if(product.category.discountValidity !==null){
//               if(product.category.discountValidity<=currentDate){
//                 await Category.findOneAndUpdate(
//                   {_id:categoryId},
//                   {$set:
//                     {
//                       discountValidity:null,
//                       discountPercentage:0
//                     }
//                   }
//                 ).then(async()=>{
//                   await Product.findOneAndUpdate({category:categoryId},
//                     {$inc:{
//                       discountedPrice:categoryDiscountedPrice
//                     }})
//                 })
//               }
//             }
            
//          })
// }

const removeImagefromFiles = (removedImages)=>{
try {
  if(!Array.isArray(removedImages)){
    const deleteFile = (imagePath) => {
      const file = path.join(__dirname,imagePath)
      fs.unlink(file, (err) => {
          if (err) {
              console.error(`Error deleting file: ${err}`);
              // Handle error, e.g., send an error response
          } else {
              console.log('File deleted successfully');
              // Perform additional actions, e.g., send a success response
          }
      });
  };

  const imagePath = `../public/productImages/${removedImages}`
  deleteFile(imagePath)
    
  }else{
    removedImages.forEach((image)=>{
      const deleteFile = (imagePath) => {
        const file = path.join(__dirname,imagePath)
        fs.unlink(file, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err}`);
                // Handle error, e.g., send an error response
            } else {
                console.log('File deleted successfully');
                // Perform additional actions, e.g., send a success response
            }
        });
    };

    const imagePath = `../public/productImages/${image}`
    deleteFile(imagePath)
    })
  }
} catch (error) {
  console.error(error.message);
}
}
  module.exports={
    createProduct,
    updateProduct,
    unListProduct,
    reListProduct,
    removeImagefromFiles
    // updateProductPage
  }
