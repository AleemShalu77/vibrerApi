const verificationSchema = require("../../model/verification");

const addVerification = async (req) => {
  const result = { data: null };
  const { name, status } = req.body;
  const Verification = await verificationSchema.create({
    name: name,
    status: status
  })
  if (Verification) {
    result.data = Verification;
    result.code = 201;
  } else {
    result.code = 204;
  }
  return result;
}

const updateVerification = async (req) => {
  const result = { data: null };
  const { id, name, status } = req.body;
  const filter = { _id: id };
  const Verification = await verificationSchema.updateOne(filter, {
    name: name,
    status: status
  }, {
    where: {
      _id: id
    }
  })
  if (Verification) {
    result.data = Verification;
    result.code = 202;
  } else {
    result.code = 204;
  }
  return result;
}

const getAllVerification = async (req) => {
  const result = { data: null };
  const Verification = await verificationSchema.find()
  if (Verification) {
    result.data = Verification;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const getVerification = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const Verification = await verificationSchema.findById(id)
  if (Verification) {
    result.data = Verification;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const deleteVerification = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const Verification = await verificationSchema.findByIdAndRemove(id)
  if (Verification) {
    result.data = Verification;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
}

module.exports = {
  addVerification,
  updateVerification,
  getAllVerification,
  getVerification,
  deleteVerification
}