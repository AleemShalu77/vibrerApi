const concertSchema = require("../../model/concerts");
const bcryptjs = require("bcryptjs");
const { format } = require("date-fns");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "_id",
      passwordField: "password",
    },
    async (_id, password, done) => {
      try {
        const user = await concertSchema
          .findOne({
            _id: _id,
          })
          .populate("concert_type", "name")
          .populate(
            "artist",
            "link _id email password artist_categories visibility verification genres status profile_img profile_cover bio city country date_of_birth full_name gender username concert_artist"
          );

        if (!user) {
          return done(null, false, { message: "Invalid concert _id " });
        }

        const match = await bcryptjs.compareSync(password, user.password);

        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

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
  let concert = [];

  try {
    if (req.body.type) {
      const currentDate = new Date();
      const currentDateString = currentDate.toISOString().split("T")[0];
      const currentTimeString = currentDate.toLocaleTimeString("en-US", {
        hour12: false,
      });

      if (req.body.type === "Archived") {
        concert = await concertSchema
          .find({ status: "Archived" })
          .populate("concert_type", "name")
          .populate(
            "artist",
            "link _id email artist_categories visibility verification genres status profile_img profile_cover bio city country date_of_birth full_name gender username concert_artist"
          );
      } else if (req.body.type === "Draft") {
        concert = await concertSchema
          .find({ publish: "Draft" })
          .populate("concert_type", "name")
          .populate(
            "artist",
            "link _id email artist_categories visibility verification genres status profile_img profile_cover bio city country date_of_birth full_name gender username concert_artist"
          );
      } else if (req.body.type === "ongoing") {
        concert = await concertSchema
          .find({
            concert_date: { $lte: currentDateString },
            $or: [
              {
                concert_date: currentDateString,
                concert_time: { $lte: currentTimeString },
              },
              { concert_date: { $lt: currentDateString } },
            ],
            status: "Active",
            publish: "Publish",
          })
          .populate("concert_type", "name")
          .populate(
            "artist",
            "link _id email artist_categories visibility verification genres status profile_img profile_cover bio city country date_of_birth full_name gender username concert_artist"
          );
      } else if (req.body.type === "upcoming") {
        concert = await concertSchema
          .find({
            concert_date: { $gte: currentDateString },
            $or: [
              {
                concert_date: currentDateString,
                concert_time: { $gte: currentTimeString },
              },
              { concert_date: { $gt: currentDateString } },
            ],
            status: "Active",
            publish: "Publish",
          })
          .populate("concert_type", "name")
          .populate(
            "artist",
            "link _id email artist_categories visibility verification genres status profile_img profile_cover bio city country date_of_birth full_name gender username concert_artist"
          );
      }
    } else {
      concert = await concertSchema
        .find()
        .populate("concert_type", "name")
        .populate(
          "artist",
          "link _id email artist_categories visibility verification genres status profile_img profile_cover bio city country date_of_birth full_name gender username concert_artist"
        );
    }

    if (concert.length > 0) {
      result.data = concert;
      result.code = 200;
    } else {
      result.code = 204;
    }
  } catch (error) {
    result.code = 500;
    result.error = error.message;
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

const login = async (req) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local-login", (err, user, info) => {
      let result = { data: null };

      if (err) {
        reject(err);
      } else if (!user) {
        result.code = 2053;
        resolve(result);
      } else {
        let payload = {
          _id: user._id,
          role: "concert",
        };

        let options = { expiresIn: "72h" };
        let token = jwt.sign(payload, JWT_SECRET, options);

        let resObj = {
          role: "concert",
          token,
          data: user,
        };

        result.data = resObj;
        result.code = 2021;
        resolve(result);
      }
    })(req);
  });
};

module.exports = {
  addConcert,
  updateConcert,
  getAllConcert,
  getConcert,
  deleteConcert,
  login,
};
