const mongoose = require('mongoose');

const liveConcertsSchema = new mongoose.Schema({
    artist:contcert_artist._id,
    title:{
        type:String,
        required:true
    },
    concert_type:{
        type:Array,
        required:true
    },
    live_on:{
        start_date:String,
        show_time:String,
        time_zone:String
    },
    price:{
        type:Number,
        required:true
    },
    artist_bio:{
        type:String,
        required:true
    },
    artist_social:{
        facebook:String,
        twitter:String,
        sportify:String,
        instagram:String,
        youtube:String,
        website:String
    },
    artist_img:{
        type:String,
        required:true
    },
    banner_xl:{
        type:String,
        required:true
    },
    banner_l:{
        type:Boolean,
        required:true
    },
    banner_m:{
        type:Boolean,
        required:true
    },
    createdBy:{
        type:String,
        required:true
    },
    updated_by:[{
        _id:String,
        updatedAt:String
    }],
    audience: [{
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


module.exports = mongoose.model('live_concerts',liveConcertsSchema) ;