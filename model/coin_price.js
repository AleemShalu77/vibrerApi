const mongoose = require('mongoose');

const coinPriceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status:{
        type:String,
        required:true
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin_users', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin_users', required: true },
    },
    {
        timestamps: true
    })


module.exports = mongoose.model('coin_price', coinPriceSchema);