const mongoose = require('mongoose');

const rolesSchema = new mongoose.Schema({
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


module.exports = mongoose.model('roles',rolesSchema) ;