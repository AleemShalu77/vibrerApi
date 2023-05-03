const mongoose = require('mongoose');

const virtualGiftsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    icon:{
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


module.exports = mongoose.model('virtual_gifts',virtualGiftsSchema) ;