const mongoose = require('mongoose');

const adminUsersSchema = new mongoose.Schema({
    name:{
        first_name:{
            type:String,
            required:true
        },
        last_name:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    verification:{
        type:Boolean,
        required:true
    },
    verification_token:{
        type:String,
        required:true
    },
    forgotPasswordToken: {
        token: String,
        expiresAt: Date
    },
    profile_img:{
        type:String,
        required:true
    },
    createdBy:{
        type:String,
        required:true
    },
    updatedBy:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }
},
{
     timestamps: true 
})

module.exports = mongoose.model('admin_users',adminUsersSchema) ;