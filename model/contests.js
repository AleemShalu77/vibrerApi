const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    contest_type: { type: mongoose.Schema.Types.ObjectId, ref: 'type', required: true },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    conditions: {
        type: String,
        required: true
    },
    reward: {
        type: String,
        required: true
    },
    time_zone: {
        type: String,
        required: true
    },
    starts_on: {
        start_date: {
            type: String,
            required: true
        },
        start_time: {
            type: String,
            required: true
        }
    },
    ends_on: {
        end_date: {
            type: String,
            required: true
        },
        end_time: {
            type: String,
            required: true
        }
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
    // participants: {
    //     video_post: [{
    //         start_date: {
    //             type: String,
    //             required: true
    //         },
    //         end_time: {
    //             type: String,
    //             required: true
    //         }
    //     }],
    //     votes: [{
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'user'
    //     }],
    // },
    // winner: {
    //     type: String,
    //     required: true
    // },
    // winner_second: {
    //     type: String,
    //     required: true
    // },
    // winner_third: {
    //     type: String,
    //     required: true
    // },
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

module.exports = mongoose.model('contests', contestSchema);
