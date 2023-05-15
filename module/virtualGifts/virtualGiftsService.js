const virtualGiftsSchema = require("../../model/virtual_gifts");
const VERTUAL_GIFT_ICON_URL = require("../../config/index")

const addVirtualGift = async (req) => {
  const result = { data: null };
  const { name, status } = req.body;
  const icon_img = `${VERTUAL_GIFT_ICON_URL}` + `${req.file}`
  const VirtualGift = await virtualGiftsSchema.create({
    name: name,
    icon: icon_img,
    status: status
  })
  if (VirtualGift) {
    result.data = VirtualGift;
    result.code = 201;
  } else {
    result.code = 204;
  }
  return result;
}

const updateVirtualGift = async (req) => {
  const result = { data: null };
  const { id, name, status } = req.body;
  //   const icon_img = `${VERTUAL_GIFT_ICON_URL}`+`${req.file}`
  const filter = { _id: id };
  const VirtualGift = await virtualGiftsSchema.updateOne(filter, {
    name: name,
    // icon:icon_img,
    status: status
  }, {
    where: {
      _id: id
    }
  })
  if (VirtualGift) {
    result.data = VirtualGift;
    result.code = 202;
  } else {
    result.code = 204;
  }
  return result;
}

const getAllVirtualGift = async (req) => {
  const result = { data: null };
  const VirtualGift = await virtualGiftsSchema.find()
  if (VirtualGift) {
    result.data = VirtualGift;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const getVirtualGift = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const VirtualGift = await virtualGiftsSchema.findById(id)
  if (VirtualGift) {
    result.data = VirtualGift;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const deleteVirtualGift = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const VirtualGift = await virtualGiftsSchema.findByIdAndRemove(id)
  if (VirtualGift) {
    result.data = VirtualGift;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
}

module.exports = {
  addVirtualGift,
  updateVirtualGift,
  getAllVirtualGift,
  getVirtualGift,
  deleteVirtualGift
}