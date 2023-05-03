const mongoose = require('mongoose');

const concertTypeSchema = new mongoose.Schema({
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

module.exports = mongoose.model('concert_type',concertTypeSchema) ;