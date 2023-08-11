const concertSchema = require("../../model/concerts");
const bcryptjs = require('bcryptjs');
const addConcert = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const { concert_type, artist, title, description, price, time_zone, concert_date, concert_time, tags, banner, status, publish } = req.body;
  const password = await bcryptjs.hashSync(req.body.password, 10);
  const coinPriceCheck = await concertSchema.findOne({ concert_type: concert_type, title: title });
  if(coinPriceCheck)
  {
    result.code = 205;
  }
  else
  {
  
  const concert = await concertSchema.create({
    concert_type: concert_type,
    title: title,
    description: description,
    price: price,
    artist:artist,
    time_zone: time_zone,
    concert_date: concert_date,
    concert_time: concert_time,
    banner: banner,
    tags: tags,
    password: password,
    createdBy: payload.id,
    updatedBy: payload.id,
    status: status,
    publish: publish
  })
  if (concert) {
    result.data = concert
    result.code = 201;
  } else {
    result.code = 204;
  }
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
  addConcert,
  updateConcertType,
  getAllConcertType,
  getConcertType,
  deleteConcertType
}