const platformCommisionSchema = require("../../model/platform_commision");

const addPlatformCommission = async (req) => {
  const result = { data: null };
  const { name, value, status } = req.body;
  const PlatformCommision = await platformCommisionSchema.create({
    name: name,
    value: value,
    status: status
  })
  if (PlatformCommision) {
    result.data = PlatformCommision;
    result.code = 201;
  } else {
    result.code = 204;
  }
  return result;
}

const updatePlatformCommission = async (req) => {
  const result = { data: null };
  const { id, name, value, status } = req.body;
  const filter = { _id: id };
  const PlatformCommision = await platformCommisionSchema.updateOne(filter, {
    name: name,
    value: value,
    status: status
  }, {
    where: {
      _id: id
    }
  })
  if (PlatformCommision) {
    result.data = PlatformCommision;
    result.code = 201;
  } else {
    result.code = 204;
  }
  return result;
}

const getAllPlatformCommission = async (req) => {
  const result = { data: null };
  const PlatformCommision = await platformCommisionSchema.find()
  if (PlatformCommision) {
    result.data = PlatformCommision;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const getPlatformCommission = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const PlatformCommision = await platformCommisionSchema.findById(id)
  if (PlatformCommision) {
    result.data = PlatformCommision;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const deletePlatformCommission = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const PlatformCommision = await platformCommisionSchema.findByIdAndRemove(id)
  if (PlatformCommision) {
    result.data = PlatformCommision;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
}

module.exports = {
  addPlatformCommission,
  updatePlatformCommission,
  getAllPlatformCommission,
  getPlatformCommission,
  deletePlatformCommission
}