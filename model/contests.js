const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    contest_type:{
        type:Array,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    conditions:{
        type:String,
        required:true
    },
    reward:{
        type:String,
        required:true
    },
    time_zone:{
        type:String,
        required:true
    },
    starts_on:{
        start_date:String,
        start_time:String,
    },
    ends_on:{
        start_date:String,
        start_time:String,
    },
    participants:{
                video_post : [{
                    start_date:String,
                    end_time:String
                }],
                votes:[{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'user'
                }],
    },
    winner:{
        type:String,
        required:true
    },
    winner_second:{
        type:String,
        required:true
    },
    winner_third:{
        type:String,
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
    status:{
        type:Array,
        required:true
    }
},
{
     timestamps: true 
})


module.exports = mongoose.model('contests',contestSchema) ;