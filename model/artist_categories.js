const mongoose = require('mongoose');

const artistCategoriesSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true, // Ensures the 'name' is unique in the database
    },
    status:{
        type:String,
        required:true
    }
},
{
     timestamps: true 
})


module.exports = mongoose.model('artist_categories',artistCategoriesSchema) ;