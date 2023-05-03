const mongoose = require('mongoose');

const userFansSchema = new mongoose.Schema({
    eamil:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
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
    country:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    profile_img:{
        type:String,
        required:true
    },
    createdBy:{
        type:String,
        required:true
    },
    blocked_user:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
    following:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
    votes:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'contests'
	}],
    playlist:[{_id:String}],
    wallet_id:{
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


module.exports = mongoose.model('user_fans',userFansSchema) ;