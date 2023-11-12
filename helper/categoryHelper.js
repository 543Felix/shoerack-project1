const Product = require('../model/productModel')
const Category = require('../model/categoryModel')
const createCategory = (data)=>{
return new Promise(async(resolve,reject)=>{
    try {
      const category = new Category({
        categoryName:data.categoryName,
        description:data.description
      })  
      const savedCategory = category.save()
      resolve(savedCategory)
    } catch (error) {
      reject(error)
        console.error(error.message);
    }
})

}

const loadupdateCategory = (userId)=>{
  return new Promise((resolve,reject)=>{
    Category.findById({_id:userId})
    .then((categoryData) => {
      resolve(categoryData);
    }).catch((err) => {
      console.error(err.message);
      reject(err)
    });
  })
}

const updateCategory=async(id,data)=>{
  try {
    await Category.findByIdAndUpdate({_id:id},{$set:{categoryName:data.categoryName,description:data.description}})
    // const categoryData = await Category.findById({_id:id})
    // console.log("updateCategoryhelper =",categoryData);
  } catch (error) {
    console.error(error.message);
  }
}
const unlistCategory = async(Id)=>{
 try {
  await Category.findByIdAndUpdate({_id:Id},{$set:{isListed:false}})
  await Product.findOneAndUpdate({category:Id},{$set:{isCategoryListed:false}})
 } catch (error) {
  console.error(error.message);
 }
}

const relistCategory=async(Id)=>{
  try {
    await Category.findByIdAndUpdate({_id:Id},{$set:{isListed:true}})
    await Product.findOneAndUpdate({category:Id},{$set:{isCategoryListed:true}})
  } catch (error) {
   console.error(error.message); 
  }
}
module.exports={
  createCategory,
  unlistCategory,
  relistCategory,
  loadupdateCategory,
  updateCategory
}