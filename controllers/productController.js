const Product = require('../model/productModel')
const category = require('../model/categoryModel')
const productHelper = require('../helper/productHelper')
const offerHelper = require('../helper/offerHelper')

    const loadaddProduct = async(req,res)=>{
        try {
            const Category = await category.find({})
            res.render('addProduct',{category:Category})
        } catch (error) {
            console.error(error.message);
        }
    }

    const createProduct = async(req,res)=>{
        try {
            const Category = category.find({})  
            if (!req.body.name || req.body.name.trim().length === 0) {
                return res.render("addProduct", { message: "Name is required",category:Category });
            }
            if (!req.body.description || req.body.description.trim().length === 0) {
              return res.render("addProduct", { message: "Description is required",category:Category });
          }
            if(req.body.price<=0){
              return res.render("addProduct", { message: "Product Price Should be greater than 0",category:Category });
            }
            if(req.body.stock< 0 || req.body.stock.trim().length === 0 ){
              return res.render("addProduct", { message: "Stock  Should be greater than 0",category:Category });
            }
        
              const images = req.files.map(file => file.filename);
              await productHelper.createProduct(req.body,images)
              res.redirect('/admin/productsList');
        } catch (error) {
           console.error(error.message); 
        }
    }
     
    const displayProduct = async(req,res)=>{
        try {
    
          const product = await Product.find({}).populate('category')
          res.render('productsList',{product:product})    
        } catch (error) {
          console.log(error.message)
        }
      }
      const loadUpdateProduct = async(req,res)=>{
        try {
          const categories = await category.find({})
          const id = req.query.id;
          const productData = await Product.findById({_id:id}).populate('category')
          res.render('updateProduct',{product:productData,category:categories})
          
        } catch (error) {
          console.log(error)
          
        }
      }

      const updateProduct = async (req, res) => {
        try {
    
          const productData = await Product.findById(req.body.id)
          const categories = await category.find({})
          if (!req.body.productName || req.body.productName.trim().length === 0) {
            return res.render("updateProduct", { message: "Name is required",product:productData,category:categories });
        }
        if (!req.body.description || req.body.description.trim().length === 0) {
          return res.render("updateProduct", { message: "Description is required",product:productData,category:categories });
      }
        if(req.body.price<=0){
          return res.render("updateProduct", { message: "Product Price Should be greater than 0",product:productData,category:categories });
        }
        if(req.body.stock<0 || req.body.stock.trim().length === 0 ){
          return res.render("updateProduct", { message: "Stock Should be greater than 0",product:productData,category:categories });
        }
            const images = req.files.map(file => file.filename);
            const updatedImages = images.length > 0 ? images : productData.images;
            await productHelper.updateProduct(req.body,updatedImages)
            await offerHelper.addOfferPriceforSingleProduct(req.body.id)
            res.redirect('/admin/productsList');
        } catch (error) {
          console.log(error.message);
        }
      };

      const unListProduct = async(req,res)=>{
        try {
          await productHelper.unListProduct(req.query.id)
    
            res.redirect('/admin/productsList')
            
        } catch (error) {
            console.log(error.message);
        }
      }

      const reListProduct = async(req,res)=>{
        try {
    
            await productHelper.reListProduct(req.query.id)
            res.redirect('/admin/productsList')
        } catch (error) {
            console.log(error.message);
        }
      }
   
      const singleProduct = async(req,res)=>{
        try {
            const id = req.query.id
            const product = await Product.findById(id).populate('category')
            if(product.isProductListed == true && product.isCategoryListed == true){
                res.render('product',{product})
            }else{
                res.redirect('shop')
            }
        } catch (error) {
           console.error(error.message); 
        }
       }
    module.exports={
        loadaddProduct,
        createProduct,
        displayProduct,
        loadUpdateProduct,
        updateProduct,
        unListProduct,
        reListProduct,
        singleProduct
    }