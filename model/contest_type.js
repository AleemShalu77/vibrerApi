const mongoose = require('mongoose');

const contestTypeSchema = new mongoose.Schema({
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

module.exports = mongoose.model('contest_type',contestTypeSchema) ;