const fs = require('fs')
const path = require('path')

const deleteImage= (filename)=>{
    try {
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

        const imagePath = `../public/bannerImages/${filename}`
        deleteFile(imagePath)
    } catch (error) {
      console.log(error.message);  
    }
}


module.exports ={
    deleteImage
}