const badgeSchema = require("../../model/badge");
const { BADGE_ICON_URL } = require("../../config/index")
const adminUsersSchema = require("../../model/admin_users")

const addBadge = async (req) => {
  const result = { data: null };
  const { name } = req.body;
  const payload = req.decoded;
  const icon_img = `${BADGE_ICON_URL}` + `${req.file}`;
  const badge = await badgeSchema.create({
    name: name,
    icon: icon_img,
    updated_by: payload.id,
  })
  if (badge) {
    result.data = badge;
    result.code = 201;
  } else {
    result.code = 204;
  }
  return result;
}

const updateBadge = async (req) => {
  const result = { data: null };
  const { id, name } = req.body;
  const payload = req.decoded;
    const icon_img = `${BADGE_ICON_URL}`+`${req.file}`
  const filter = { _id: id };
  const badge = await badgeSchema.updateOne(filter, {
    name: name,
    icon:icon_img,
    updated_by: payload.id,
  }, {
    where: {
      _id: id
    }
  })
  if (badge) {
    result.data = badge;
    result.code = 202;
  } else {
    result.code = 204;
  }
  return result;
}

const getAllBadge = async (req) => {
  const result = { data: null };
  const badge = await badgeSchema.find()
  if (badge) {
    result.data = badge;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const getBadge = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const badge = await badgeSchema.findById(id
  )
      
  if (badge) {
    result.data = badge;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const deleteBadge = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const badge = await badgeSchema.findByIdAndRemove(id)
  if (badge) {
    result.data = badge;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
}

module.exports = {
  addBadge,
  updateBadge,
  getAllBadge,
  getBadge,
  deleteBadge
}