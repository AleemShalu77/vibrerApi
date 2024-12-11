const concertSchema = require("../../model/concerts");
const bcryptjs = require("bcryptjs");
const { format } = require("date-fns");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const appUsersSchema = require("../../model/app_users");

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

const getArtistConcerts = async (req) => {
  const result = { data: null };

  try {
    // Retrieve all concert artists with the specified fields
    const artists = await appUsersSchema.find(
      {
        $and: [
          { concert_artist: true }, // Must be a concert artist
          {
            $or: [
              { "account_deleted.is_deleted": { $ne: true } }, // Not deleted
              { account_deleted: { $exists: false } }, // `account_deleted` field does not exist
            ],
          },
        ],
      },
      {
        link: 1,
        _id: 1,
        email: 1,
        artist_categories: 1,
        verification: 1,
        genres: 1,
        status: 1,
        profile_img: 1,
        profile_cover: 1,
        bio: 1,
        city: 1,
        country: 1,
        date_of_birth: 1,
        full_name: 1,
        gender: 1,
        username: 1,
        concert_artist: 1,
      }
    );

    // If no artists are found, return a 204 code
    if (artists.length === 0) {
      result.code = 204;
      return result;
    }

    // Prepare an array to hold the artist-wise data
    const artistConcertsArray = [];

    // Loop through each artist to find their concerts
    for (const artist of artists) {
      const artistConcerts = await concertSchema
        .find({ artist: artist._id })
        .populate("concert_type", "name");

      if (artistConcerts.length > 0) {
        // Create the artist entry with grouped concerts
        const concertsGroupedByStatus = {
          Active: [],
          Archived: [],
          Draft: [],
        };

        // Group concerts by status for this artist
        for (const concert of artistConcerts) {
          if (concert.status in concertsGroupedByStatus) {
            concertsGroupedByStatus[concert.status].push(concert);
          }
        }

        // Filter out empty status groups
        const nonEmptyConcerts = Object.entries(concertsGroupedByStatus).reduce(
          (acc, [status, concerts]) => {
            if (concerts.length > 0) {
              acc[status] = concerts;
            }
            return acc;
          },
          {}
        );

        if (Object.keys(nonEmptyConcerts).length > 0) {
          artistConcertsArray.push({
            artistDetails: artist,
            concertsGroupedByStatus: nonEmptyConcerts,
          });
        }
      }
    }

    if (artistConcertsArray.length > 0) {
      result.data = artistConcertsArray;
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

module.exports = {
  addConcert,
  updateConcert,
  getAllConcert,
  getConcert,
  deleteConcert,
  login,
  getArtistConcerts,
};
