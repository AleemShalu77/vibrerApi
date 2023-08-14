const concertSchema = require("../../model/concerts");
const bcryptjs = require('bcryptjs');
const { format } = require('date-fns');

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

const getAllConcert = async (req) => {
  const result = { data: null };
  if(req.body.type){ 
    if(req.body.type == 'Archived')
    {
      var concert = await concertSchema.find({
        status: 'Archived'
      });
    }
    else if(req.body.type == 'Draft')
    {
      var concert = await concertSchema.find({
        publish: 'Draft'
      });
    }
    else if(req.body.type == 'ongoing')
    {
      const currentDate = new Date(); // Get the current date and time
      const currentDateString = currentDate.toISOString().split('T')[0];
      const currentTimeString = currentDate.toLocaleTimeString('en-US', { hour12: false });
  
      var concert = await concertSchema.find({
        concert_date: { $lte: currentDateString },
        $or: [
          { concert_date: currentDateString, concert_time: { $lte: currentTimeString } },
          { concert_date: { $lt: currentDateString } }
        ],
        status: 'Active', // assuming active means the concert is ongoing
        publish: 'Publish' // assuming published means the concert is available to the public
      });
    }
    else if(req.body.type == 'upcoming')
    {
      const currentDate = new Date(); // Get the current date and time
      const currentDateString = currentDate.toISOString().split('T')[0];
      const currentTimeString = currentDate.toLocaleTimeString('en-US', { hour12: false });
  
      var concert = await concertSchema.find({
        concert_date: { $gte: currentDateString },
        $or: [
          { concert_date: currentDateString, concert_time: { $gte: currentTimeString } },
          { concert_date: { $gt: currentDateString } }
        ],
        status: 'Active', // assuming active means the concert is ongoing
        publish: 'Publish' // assuming published means the concert is available to the public
      });
    }
  }
  else
  {
    var concert = await concertSchema.find();
  }
  if (concert && concert.length > 0) {
    result.data = concert;
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
  getAllConcert,
  getConcertType,
  deleteConcertType
}