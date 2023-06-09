const concertTypeSchema = require("../../model/concert_type");

const addConcertType = async (req) => {
  const result = { data: null };
  const { name, status } = req.body;
  const concertType = await concertTypeSchema.create({
    name: name,
    status: status
  })
  if (concertType) {
    result.data = concertType;
    result.code = 201;
  } else {
    result.code = 204;
  }
  return result;
}

const updateConcertType = async (req) => {
  const result = { data: null };
  const { id, name, status } = req.body;
  const filter = { _id: id };
  const concertType = await concertTypeSchema.updateOne(filter, {
    name: name,
    status: status
  }, {
    where: {
      _id: id
    }
  })
  if (concertType) {
    result.data = concertType;
    result.code = 202;
  } else {
    result.code = 204;
  }
  return result;
}

const getAllConcertType = async (req) => {
  const result = { data: null };
  const concertType = await concertTypeSchema.find()
  if (concertType) {
    result.data = concertType;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const getConcertType = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const concertType = await concertTypeSchema.findById(id)
  if (concertType) {
    result.data = concertType;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const deleteConcertType = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const concertType = await concertTypeSchema.findByIdAndRemove(id)
  if (concertType) {
    result.data = concertType;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
}

module.exports = {
  addConcertType,
  updateConcertType,
  getAllConcertType,
  getConcertType,
  deleteConcertType
}