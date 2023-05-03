const mongoose = require('mongoose');

const artistStatusSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    status:{
        type:Array,
        required:true
    }
},
{
     timestamps: true 
})


module.exports = mongoose.model('artist_status',artistStatusSchema) ;