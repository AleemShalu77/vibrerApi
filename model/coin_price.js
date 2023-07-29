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
    updated_by: {
        admin_id: {
            type: String,
            required: true
        },
        admin_name: {
            type: String,
            required: true
        },
        admin_email: {
            type: String,
            required: true
        }
    },
    status: {
        type: Array,
        required: true
    }
},
    {
        timestamps: true
    })


module.exports = mongoose.model('coin_price', coinPriceSchema);