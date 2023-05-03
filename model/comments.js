const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    post_id:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'media_post'
	}],
    description:{
        type:String,
        required:true
    },
    reply:[{
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


module.exports = mongoose.model('comments',commentsSchema) ;