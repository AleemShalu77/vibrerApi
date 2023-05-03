const mongoose = require('mongoose');

const userArtistsSchema = new mongoose.Schema({
    eamil:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    artist_categories:{
        type:Array,
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
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    concert_artist:{
        type:Boolean,
        required:true
    },
    visibility:{
        type:Boolean,
        required:true
    },
    chat:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        required:true
    },
    profile_img:{
        type:String,
        required:true
    },
    profile_cover:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        required:true
    },
    badges:{
        type:Array,
        required:true
    },
    gallery_imgs:[string],
    music_videos:[{ _id:string }],
    music:[{ _id:string }],
    link:{
        facebook:String,
        twitter:String,
        sportify:String,
        instagram:String,
        youtube:String,
        website:String
    },
    blocked_user:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
    followers:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
    following:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
    likes:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
    liked:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
    votes:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'contests'
	}],
    playlist:[{_id:String}],
    blocked:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
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


module.exports = mongoose.model('user_artists',userArtistsSchema) ;