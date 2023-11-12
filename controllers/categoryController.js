
const Category = require('../model/categoryModel')

 const categoryHelper = require('../helper/categoryHelper')

const loadCategory = async(req,res)=>{
try {
    const categories = await Category.find()
    // console.log("load category check",categories);
    res.render('showCategory',{ categories: categories })
} catch (error) {
    console.error(error.message);
}
}

const loadAddCategory = async(req,res)=>{
    try {
      res.render('addCategory')  
    } catch (error) {
       console.error(error.message); 
    }
}
 
const createCategory = async(req,res)=>{
    try {
        const category = req.body.categoryName.toLowerCase()
        const existingCategory = await Category.findOne({categoryName:category})
        // console.log(existingCategory);
        if(existingCategory){
            res.render('addCategory',{message:"this category already exists"})
        }  
        else if(!req.body.categoryName||req.body.categoryName.trim().length===0&& !req.body.description||req.body.description.trim().length===0){
            res.render('addCategory',{message:"both categoryName and description is required"})
        }
        else{
            await categoryHelper.createCategory(req.body)
            res.redirect('/admin/showCategory')
        }
    } catch (error) {
        console.error(error.message);
    }
}
const loadupdateCategory = async(req,res)=>{
    try {
        const id = req.query.id
       const categoryData = await categoryHelper.loadupdateCategory(id)
      res.render('updateCategory',{Category:categoryData})  
    } catch (error) {
       console.error(error.message); 
    }
}

async function updateCategory(req,res){
    try {
    const id = req.query.id
    await categoryHelper.updateCategory(id,req.body)
    res.redirect('/admin/showCategory')
    } catch (error) {
       console.error(error.message); 
    }
}
const unlistCategory = async(req,res)=>{
   try {
    await categoryHelper.unlistCategory(req.query.id)
    res.redirect('/admin/showCategory')
   } catch (error) {
    console.error(error.message);
   } 
}

const relistCategory = async(req,res)=>{
    try {
       await categoryHelper.relistCategory(req.query.id) 
       res.redirect('/admin/showCategory')
    } catch (error) {
       console.error(error.message); 
    }
}
module.exports={
    loadCategory,
    loadAddCategory,
    createCategory,
    unlistCategory,
    relistCategory,
    loadupdateCategory,
    updateCategory
}