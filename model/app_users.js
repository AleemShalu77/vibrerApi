const mongoose = require("mongoose");
const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    media_url: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "disabled"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const appUsersSchema = new mongoose.Schema(
  {
    user_type: {
      type: String,
      enum: ["Artist", "Fan"],
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: false,
    },
    artist_categories: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "artist_categories", // Reference the artistCategories model
        },
      ],
      required: false,
    },
    full_name: {
      type: String,
      required: false,
    },
    name: {
      first_name: {
        type: String,
        required: false,
      },
      last_name: {
        type: String,
        required: false,
      },
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: false,
    },
    date_of_birth: {
      type: Date, // Assuming date of birth will be stored as a Date type
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    // state:{
    //     type:String,
    //     required:true
    // },
    country: {
      type: String,
      required: false,
    },
    concert_artist: {
      type: Boolean,
      required: false,
    },
    visibility: {
      type: String,
      enum: ["Private", "Public"],
      required: false,
    },
    // chat:{
    //     type:String,
    //     required:true
    // },
    bio: {
      type: String,
      required: false,
    },
    profile_img: {
      type: String,
      required: false,
    },
    profile_cover: {
      type: String,
      required: false,
    },
    verified: {
      type: Boolean,
      required: false,
    },
    verification: {
      type: Boolean,
      required: true,
    },
    verification_token: {
      type: String,
      required: true,
    },
    forgotPasswordToken: {
      token: String,
      expiresAt: Date,
    },
    genres: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "genre", // Reference the artistCategories model
        },
      ],
      required: false,
    },
    gallery: [gallerySchema],
    // music_videos:[{ _id:String }],
    // music:[{ _id:String }],
    link: {
      facebook: String,
      twitter: String,
      // sportify:String,
      instagram: String,
      youtube: String,
      website: String,
    },
    favourites: [
      {
        contest_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "contests",
        },
        participant_ids: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user_artists",
          },
        ],
      },
    ],
    account_deleted: {
      type: {
        is_deleted: {
          type: Boolean,
          default: false,
        },
        deleted_by: {
          user_type: {
            type: String,
            enum: ["admin", "self"],
          },
          admin_email: {
            type: String,
            required: false,
          },
          admin_name: {
            type: String,
            required: false,
          },
        },
        deletedAt: {
          type: Date,
          default: null,
        },
      },
      required: false,
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
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("app_users", appUsersSchema);
