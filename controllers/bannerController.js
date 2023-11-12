
const Banner = require('../model/bannerModel')
const bannerHelpper = require('../helper/bannerHelpper')
const path = require('path')


const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/bannerImages'); // Specify the destination folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now(); // Get the current timestamp
        const ext = path.extname(file.originalname); // Get the file extension
        const filename = uniqueSuffix + ext; // Construct the filename with timestamp and extension
        cb(null, filename);
    },
});

// Set up the multer middleware with size limit (in bytes)

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB (adjust the size limit as needed)

    },
}).array('image', 5); // 'image' should match the name attribute of your file input



const addBanner = async(req,res)=>{
    try {
        res.render('addBanner')
    }
    catch (error) {
        console.log(error.message)
    }
}

// const upload = multer({ storage: storage });

const postbanner = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred during upload
                console.log("Multer error:", err);
            } else if (err) {
                // An unknown error occurred during upload
                console.log("Unknown error:", err);
            }

            console.log(req.files); // This should print an array of uploaded files

            const { title, link ,text} = req.body;

            // req.files contains the array of uploaded image details
            const imageNames = req.files.map((file) => path.basename(file.path));
           

            const newBanner = new Banner({
                title,
                link,
                image: imageNames,
                text
            });

            try {
                // Save the banner to the database
                await newBanner.save();
                res.redirect('/admin/bannerList')
            } catch (error) {
                console.log(error.message);
                res.status(500).send('An error occurred while adding the banner.');
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('An error occurred while uploading files.');
    }
};

const listBanner = async(req,res)=>{
    const banner =  await Banner.find()
    res.render('bannerList',{banner}) 

}
const deleteBanner = async(req,res)=>{
    try {
        const bannerTitle = req.query.title;
        
        const banner = await Banner.findOne({title:bannerTitle})
          const deletedBanner = await Banner.findOneAndDelete({ title: bannerTitle });
          console.log("deleteBanner =",banner.image[0]);
          await bannerHelpper.deleteImage(banner.image[0])
          if (!deletedBanner) {
            return res.status(404).send("Banner not found");
        }else{
            res.redirect('/admin/bannerList')
        }

         
    } catch (error) {
        console.error(error);
    }
}

module.exports={
    addBanner,
    postbanner,
    listBanner,
    deleteBanner
    
}