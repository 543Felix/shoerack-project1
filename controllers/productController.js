const Product = require('../model/productModel')
const category = require('../model/categoryModel')
const productHelper = require('../helper/productHelper')
const offerHelper = require('../helper/offerHelper')
const cartHelper = require('../helper/cartHelper')
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
          res.render('updateProduct',{product:productData,categories:categories})
          
        } catch (error) {
          console.log(error)
          
        }
      }

      const updateProduct = async (req, res) => {
        try {
          var existingImages = req.body.existingImages || []
          const removedImages = req.body.removedImages || [];
          if(removedImages != []){
            await productHelper.removeImagefromFiles(removedImages)
          }
          var newImages  = []
          for(let i=0;i<req.files.length;i++){
            if(req.files[i]!==undefined){
              newImages.push(req.files[i].filename)
            }
          }
          const remainingImages = existingImages.filter(image => !removedImages.includes(image));
      

          const productId = req.params.id;
          const product = await Product.find({_id:productId})
             const updatedImages = newImages.concat(remainingImages)
            await productHelper.updateProduct(req.body,updatedImages,productId)
            if(product[0].price !== req.body.price){
              await offerHelper.addOfferPriceforSingleProduct(productId)
             await cartHelper.updateSingleProduct(productId)
            }
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
              res.redirect('/error-404')

            }
        } catch (error) {
           console.error(error.message); 
           res.redirect('/error-404')
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



    const updateEditProduct = async (req, res) => {
      try {
          upload.array('images')(req, res, async (err) => {
              if (err) {  
                  console.error(err);
                  return res.redirect('/admin');
              }
              var existingImages = req.body.existingImages || []
              const removedImages = req.body.removedImages || [];
              var newImages  = []
              for(let i=0;i<req.files.length;i++){
                if(req.files[i]!==undefined){
                  newImages.push(req.files[i].filename)
                }
              }
              const remainingImages = existingImages.filter(image => !removedImages.includes(image));
          
    
              const productId = req.params.id;
              const existingProduct = await Product.findById(productId);
    
              const category = await Category.findOne({ _id: req.body.category });
    
              // Check if new images are uploaded
              // let newImageNames = existingProduct.images;
              // if (req.files && req.files.length > 0) {
              //     newImageNames = req.files.map((file) => path.basename(file.path));
              // }
    
              const updatedProduct = await Product.findByIdAndUpdate(
                  productId,
                  {
                      name: req.body.name,
                      description: req.body.description,
                      price: req.body.price,
                      category: category._id,
                      stock: req.body.stock,
                      offerprice: req.body.offerprice,
                      images:remainingImages.concat(newImages),
                  },
                  { new: true }
              );
    
              res.redirect('/admin/productView');
          });
      } catch (error) {
          console.error(error.message);
          res.status(500).send('Internal Server Error');
      }
    };