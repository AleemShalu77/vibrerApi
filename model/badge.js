const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    icon:{
        type:String,
        required:true
    },
    updated_by:{
        type:String,
        required:true
    },
},
{
     timestamps: true 
})


module.exports = mongoose.model('badge',badgeSchema) ;