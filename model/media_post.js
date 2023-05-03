const mongoose = require('mongoose');

const mediaPostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    media:{
        type:String,
        required:true
    },
    file_name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    meta:{
        title:String,
        description:String
    },
    likes:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
    createdBy:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
    status:{
        type:Array,
        required:true
    }
},
{
     timestamps: true 
})


module.exports = mongoose.model('media_post',mediaPostSchema) ;