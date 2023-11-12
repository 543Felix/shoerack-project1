const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
},
  image: {
    type: Array,
    required: true,
  },
    
})
const Banner = mongoose.model('Banner',bannerSchema)
module.exports = Banner