const concertSchema = require("../../model/concerts");
const bcryptjs = require("bcryptjs");
const { format } = require("date-fns");

const addConcert = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const {
    concert_type,
    artist,
    title,
    description,
    price,
    time_zone,
    concert_date,
    concert_time,
    tags,
    banner,
    status,
    publish,
  } = req.body;
  const password = await bcryptjs.hashSync(req.body.password, 10);
  const coinPriceCheck = await concertSchema.findOne({
    concert_type: concert_type,
    title: title,
  });
  if (coinPriceCheck) {
    result.code = 205;
  } else {
    const concert = await concertSchema.create({
      concert_type: concert_type,
      title: title,
      description: description,
      price: price,
      artist: artist,
      time_zone: time_zone,
      concert_date: concert_date,
      concert_time: concert_time,
      banner: banner,
      tags: tags,
      password: password,
      createdBy: payload.id,
      updatedBy: payload.id,
      status: status,
      publish: publish,
    });
    if (concert) {
      result.data = concert;
      result.code = 201;
    } else {
      result.code = 204;
    }
  }
  return result;
};

const updateConcert = async (req) => {
  const payload = req.decoded;
  const result = { data: null };
  const {
    id,
    concert_type,
    artist,
    title,
    description,
    price,
    time_zone,
    concert_date,
    concert_time,
    tags,
    banner,
    status,
    publish,
  } = req.body;
  try {
    const concert = await concertSchema.findOne({ _id: id });

    if (!concert) {
      result.code = 206; // Contest not found
    } else {
      const concertAlreadyExists = await concertSchema.findOne({
        _id: { $ne: id },
        concert_type: concert_type,
        title: title,
      });
      if (concertAlreadyExists) {
        result.code = 205; // Contest exists with same data
      } else {
        // Update contest fields
        concert.concert_type = concert_type;
        concert.artist = artist;
        concert.title = title;
        concert.description = description;
        concert.price = price;
        concert.time_zone = time_zone;
        concert.concert_date = concert_date;
        concert.concert_time = concert_time;
        concert.tags = tags;
        concert.banner = banner;
        concert.updatedBy = payload.id;
        concert.updatedAt = new Date();
        concert.status = status;
        concert.publish = publish;

        const updatedConcert = await concert.save(); // Save the updated contest

        if (updatedConcert) {
          result.data = updatedConcert;
          result.code = 202; // Successful update
        } else {
          result.code = 204; // Update failed
        }
      }
    }
  } catch (error) {
    console.error("Error updating contest:", error);
    result.code = 500; // Internal server error
  }
  return result;
};

const getAllConcert = async (req) => {
  const result = { data: null };
  if (req.body.type) {
    if (req.body.type == "Archived") {
      var concert = await concertSchema.find({
        status: "Archived",
      });
    } else if (req.body.type == "Draft") {
      var concert = await concertSchema.find({
        publish: "Draft",
      });
    } else if (req.body.type == "ongoing") {
      const currentDate = new Date(); // Get the current date and time
      const currentDateString = currentDate.toISOString().split("T")[0];
      const currentTimeString = currentDate.toLocaleTimeString("en-US", {
        hour12: false,
      });

      var concert = await concertSchema.find({
        concert_date: { $lte: currentDateString },
        $or: [
          {
            concert_date: currentDateString,
            concert_time: { $lte: currentTimeString },
          },
          { concert_date: { $lt: currentDateString } },
        ],
        status: "Active", // assuming active means the concert is ongoing
        publish: "Publish", // assuming published means the concert is available to the public
      });
    } else if (req.body.type == "upcoming") {
      const currentDate = new Date(); // Get the current date and time
      const currentDateString = currentDate.toISOString().split("T")[0];
      const currentTimeString = currentDate.toLocaleTimeString("en-US", {
        hour12: false,
      });

      var concert = await concertSchema.find({
        concert_date: { $gte: currentDateString },
        $or: [
          {
            concert_date: currentDateString,
            concert_time: { $gte: currentTimeString },
          },
          { concert_date: { $gt: currentDateString } },
        ],
        status: "Active", // assuming active means the concert is ongoing
        publish: "Publish", // assuming published means the concert is available to the public
      });
    }
  } else {
    var concert = await concertSchema.find();
  }
  if (concert) {
    result.data = concert;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
};

const getConcert = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const concertType = await concertSchema.findById(id);
  if (concertType) {
    result.data = concertType;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
};

const deleteConcert = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const concertType = await concertTypeSchema.findByIdAndRemove(id);
  if (concertType) {
    result.data = concertType;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
};

module.exports = {
  addConcert,
  updateConcert,
  getAllConcert,
  getConcert,
  deleteConcert,
};
