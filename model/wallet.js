const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    account_type:{
        type:Array,
        required:true
    },
    account_number:{
        type:String,
        required:true
    },
    account_owner:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
    balance_coins:{
        type:String,
        required:true
    },
    transactions:{
        type:String,
        required:true
    },
    recievers:user._id,
    status:{
        type:Array,
        required:true
    }
},
{
     timestamps: true 
})


module.exports = mongoose.model('wallet',walletSchema) ;