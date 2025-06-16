const mongoose = require("mongoose");

// Gallery Subschema
const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "disabled"],
      required: true,
    },
  },
  { timestamps: true }
);

// Account Deletion Subschema
const accountDeletedSchema = new mongoose.Schema(
  {
    isDeleted: { type: Boolean, default: false },
    deletedBy: {
      userType: { type: String, enum: ["admin", "self"] },
      adminEmail: String,
      adminName: String,
    },
    deletedAt: { type: Date, default: null },
  },
  { _id: false }
);

// Main User Schema
const appUsersSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["Artist", "Fan"],
      required: true,
    },
    email: { type: String, required: true },
    password: { type: String, required: true },

    username: String,
    fullName: String,
    name: {
      firstName: String,
      lastName: String,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    dateOfBirth: Date,
    city: String,
    country: String,

    concertArtist: Boolean,
    visibility: {
      type: String,
      enum: ["Private", "Public"],
      default: "Public",
    },
    bio: String,
    profileImg: String,
    profileCover: String,
    verified: Boolean,

    verification: { type: Boolean, required: true },
    verificationToken: { type: String, required: true },
    forgotPasswordToken: {
      token: String,
      expiresAt: Date,
    },

    artistCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "artist_categories",
      },
    ],
    genres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "genre",
      },
    ],

    gallery: [gallerySchema],

    links: {
      facebook: String,
      twitter: String,
      instagram: String,
      youtube: String,
      website: String,
    },

    favourites: [
      {
        contestId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "contests",
        },
        participantIds: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user_artists",
          },
        ],
      },
    ],

    accountDeleted: accountDeletedSchema,

    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "app_users" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "app_users" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "app_users" }],
    blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: "app_users" }],

    status: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("app_users", appUsersSchema);
