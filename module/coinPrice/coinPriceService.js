const coinPriceSchema = require("../../model/coin_price");
const { COIN_PRICE_ICON_URL } = require("../../config/index")
const adminUsersSchema = require("../../model/admin_users")


const addCoinPrice = async (req) => {
  const result = { data: null };
  const { name, status, price, icon } = req.body;
  const payload = req.decoded;
  const coinPriceCheck = await coinPriceSchema.findOne({ name: name });
  if(coinPriceCheck)
  {
    result.code = 205;
    return result; // Return immediately if category already exists
  }
  else
  {
  const CoinPrice = await coinPriceSchema.create({
    name: name,
    icon: icon[0].file,
    price: price,
    createdBy: payload.id,
    updatedBy: payload.id,
    status: status
  })
  if (CoinPrice) {
    result.data = CoinPrice;
    result.code = 201;
  } else {
    result.code = 204;
  }
}
  return result;
}

const updateCoinPrice = async (req) => {
  const result = { data: null };
  const { id, name, status, price } = req.body;
  const icon_img = `${COIN_PRICE_ICON_URL}` + `${req.file}`
  const filter = { _id: id };
  const payload = req.decoded;
  const CoinPrice = await coinPriceSchema.updateOne(filter, {
    name: name,
    icon: icon_img,
    price: price,
    updated_by: payload.id,
    status: status
  }, {
    where: {
      _id: id
    }
  })
  if (CoinPrice) {
    result.data = CoinPrice;
    result.code = 202;
  } else {
    result.code = 204;
  }
  return result;
}

const getAllCoinPrice = async (req) => {
  const result = { data: null };
  const CoinPrice = await coinPriceSchema.find().sort({ createdAt: -1 });
  if (CoinPrice) {
    let coinPriceArry = [];
    let allcoinPrices =  CoinPrice.map((coinPriceData, key) => {
       return new Promise(async (resolve, reject) => {
       let adminInfo = await adminUsersSchema.findOne({ _id:coinPriceData.updatedBy });
       if(adminInfo)
       {
         let coinPriceObj = {
         _id :  coinPriceData._id,
         name :  coinPriceData.name,
         price :  coinPriceData.price,
         icon :  coinPriceData.icon,
         status :  coinPriceData.status,
         createdBy :  coinPriceData.createdBy,
         updatedBy :  coinPriceData.updatedBy,
         createdAt : coinPriceData.createdAt,
         updatedAt : coinPriceData.updatedAt,
         updatedName :  adminInfo.name.first_name+' '+adminInfo.name.last_name,
         updatedEmail :  adminInfo.email,
         };
         coinPriceArry.push(coinPriceObj);
       }
       return resolve();
     });	
     })
     await Promise.all(allcoinPrices);
 
     result.data = coinPriceArry;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const getCoinPrice = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const CoinPrice = await coinPriceSchema.findById(id)
  if (CoinPrice) {
    result.data = CoinPrice;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const deleteCoinPrice = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const CoinPrice = await coinPriceSchema.findByIdAndRemove(id)
  if (CoinPrice) {
    result.data = CoinPrice;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
}

module.exports = {
  addCoinPrice,
  updateCoinPrice,
  getAllCoinPrice,
  getCoinPrice,
  deleteCoinPrice
}