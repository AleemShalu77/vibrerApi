const mongoose = require('mongoose');

const userArtistsSchema = new mongoose.Schema({
    user_type: {
        type: String,
        enum: ['Artist', 'Fan'],
        required: true
    },
    email:{
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
    artist_categories: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'artist_categories', // Reference the artistCategories model
        }],
        required: true,
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
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    date_of_birth: {
        type: Date, // Assuming date of birth will be stored as a Date type
        required: true
    },
    city:{
        type:String,
        required:true
    },
    // state:{
    //     type:String,
    //     required:true
    // },
    country:{
        type:String,
        required:true
    },
    concert_artist:{
        type:Boolean,
        required:true
    },
    visibility:{
        type: String,
        enum: ['Private', 'Public'],
        required: true
    },
    // chat:{
    //     type:String,
    //     required:true
    // },
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
    genres: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'genre', // Reference the artistCategories model
        }],
        required: true,
    },
    // gallery_imgs:[{String}],
    // music_videos:[{ _id:String }],
    // music:[{ _id:String }],
    link:{
        facebook:String,
        twitter:String,
        // sportify:String,
        instagram:String,
        youtube:String,
        website:String
    },
    // blocked_user:[{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'user'
	// }],
    // followers:[{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'user'
	// }],
    // following:[{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'user'
	// }],
    // likes:[{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'user'
	// }],
    // liked:[{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'user'
	// }],
    // votes:[{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'contests'
	// }],
    // playlist:[{_id:String}],
    // blocked:[{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'user'
	// }],
    // wallet_id:{
    //     type:String,
    //     required:true
    // },
    status:{
        type:String,
        required:true
    }
},
{
     timestamps: true 
})


module.exports = mongoose.model('user_artists',userArtistsSchema) ;