const mongoose = require('mongoose');

const liveConcertBookingSchema = new mongoose.Schema({
    audience:[{
     _id : String
    }],
    total_ticlets:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    total_ticlets:{
        type:Number,
        required:true
    },
    total_coin_earned:Number //price*total_tickets

},
{
     timestamps: true 
})

module.exports = mongoose.model('live_concert_booking',liveConcertBookingSchema) ;