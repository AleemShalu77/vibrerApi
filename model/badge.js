const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    icon:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin_users', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin_users', required: true },
},
{
     timestamps: true 
})


module.exports = mongoose.model('badge',badgeSchema) ;