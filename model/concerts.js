const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
    concert_type: { type: mongoose.Schema.Types.ObjectId, ref: 'type', required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'user_artists', required: true },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    time_zone: {
        type: String,
        required: true
    },
    concert_date: {
            type: String,
            required: true
    },
    concert_time: {
        type: String,
        required: true
        
    },
    tags: {
        type: Array,
        required: true
    },
    password: {
        type: String,
        required: true
        
    },
    banner:{
        xl:{
            type: String,
            required: true
        },
        l:{
            type: String,
            required: true
        },
        m:{
            type: String,
            required: true
        }
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin_users', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin_users', required: true },
    status:{
        type:String,
        required:true
    },
    publish:{
        type:String,
        required:true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('concerts', concertSchema);
