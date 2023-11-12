const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
 destination: function(req,file,cb){
    cb(null,'./public/productImages/')
 },
 filename: function(req,file,cb){
   const fileName =Date.now()+path.extname(file.originalname)
   cb(null,fileName)
 } 
})

const banneImageSrtorage = multer.diskStorage({
   destination: function(req,file,cb){
      cb(null,'./public/bannerImages/')
   },
   filename: function(req,file,cb){
     const fileName =Date.now()+path.extname(file.originalname)
     cb(null,fileName)
   } 
  })
const imageFilter = function(req, file, cb) {
   // Accept image files only
   if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
}
cb(null, true);
 };
 
 const upload = multer({
   storage: storage,
   fileFilter: imageFilter
 }).array('file',3);

 const bannerImageUpload = multer({
   storage:banneImageSrtorage,
   fileFilter:imageFilter,
 }).single('croppedImage')

module.exports={
   upload:upload,
   update: upload, 
   bannerUpload:bannerImageUpload
}