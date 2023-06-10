const coinPriceSchema = require("../../model/coin_price");
const { COIN_PRICE_ICON_URL } = require("../../config/index")

const addCoinPrice = async (req) => {
  const result = { data: null };
  const { name, status, price } = req.body;
  const payload = req.decoded;
  const icon_img = `${COIN_PRICE_ICON_URL}` + `${req.file}`
  const CoinPrice = await coinPriceSchema.create({
    name: name,
    icon: icon_img,
    price: price,
    admin_id: payload.id,
    admin_name: payload.email,
    admin_email: payload.email,
    status: status
  })
  if (CoinPrice) {
    result.data = CoinPrice;
    result.code = 201;
  } else {
    result.code = 204;
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
  const CoinPrice = await coinPriceSchema.find()
  if (CoinPrice) {
    result.data = CoinPrice;
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