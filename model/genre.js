const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
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


module.exports = mongoose.model('genre',genreSchema) ;