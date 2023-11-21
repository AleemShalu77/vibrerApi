const userArtistsSchema = require("../../model/user_artists");
const artistCategoriesSchema = require("../../model/artist_categories");
const genreSchema = require("../../model/genre");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const nodemailer = require("nodemailer");
const { getMessage } = require("../../utils/helper");
require("dotenv").config();

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const existingUser = await userArtistsSchema.findOne({ email });

        if (existingUser) {
          return done(null, false, { message: "Email is already taken." });
        }

        const hashedPassword = await bcryptjs.hashSync(password, 10);

        const newUser = await userArtistsSchema.create({
          user_type: req.body.user_type,
          email,
          password: hashedPassword,
          username: req.body.username,
          artist_categories: req.body.artist_categories,
          name: {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
          },
          gender: req.body.gender,
          date_of_birth: req.body.date_of_birth,
          city: req.body.city,
          country: req.body.country,
          concert_artist: req.body.concert_artist,
          visibility: req.body.visibility,
          bio: req.body.bio,
          profile_img: req.body.profile_img,
          profile_cover: req.body.profile_cover,
          verified: req.body.verified,
          genres: req.body.genres,
          link: {
            facebook: req.body.facebook,
            twitter: req.body.twitter,
            instagram: req.body.instagram,
            youtube: req.body.youtube,
            website: req.body.website,
          },
          status: req.body.status,
        });

        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "local-login-artist",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await userArtistsSchema.findOne({ email });

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const match = await bcryptjs.compareSync(password, user.password);

        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid email or password" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userArtistsSchema.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const artistLogin = async (req) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local-login-artist", (err, user, info) => {
      let result = { data: null };

      if (err) {
        reject(err);
      } else if (!user) {
        result.code = 2019; // Invalid email or password
        resolve(result);
      } else {
        let payload = {
          id: user.id,
          mobile: user.email,
          role: user.role,
        };

        let options = { expiresIn: "72h" };
        let token = jwt.sign(payload, JWT_SECRET, options);

        let resObj = {
          role: user.role,
          email: user.email,
          token,
        };

        result.data = resObj;
        result.code = 2021;
        resolve(result);
      }
    })(req);
  });
};

const forgotPasswordArtist = async (req) => {
  const result = { data: null };
  const { email, confirmPassword } = req.body;
  if (req.body.password != confirmPassword) {
    result.code = 2016;
    return result;
  }
  // const pswd = await bcrypt.genSalt(10);
  // const password = await bcrypt.hash(req.body.password, pswd);
  const password = await bcryptjs.hashSync(req.body.password, 10);
  const user = await userArtistsSchema.findOne({ email });
  if (user) {
    const reset = await userArtistsSchema.updateOne(
      { email: email },
      {
        password: password,
      }
    );
    result.data = reset;
    result.code = 2015;
  } else {
    result.code = 2017;
  }
  return result;
};

const updateUserArtistSpecificColumn = async (req) => {
  const result = { data: null };
  const { id, column, value } = req.body;

  try {
    const UserArtist = await userArtistsSchema.findById(id);

    if (UserArtist) {
      // Use an object to specify the field you want to update dynamically
      const updateObject = {};
      updateObject[column] = value;

      // Update the specified field
      const reset = await userArtistsSchema.updateOne(
        { _id: id },
        updateObject
      );
      if (reset) {
        result.data = reset;
        result.code = 202;
      } else {
        result.code = 400;
      }
    } else {
      result.code = 2017;
    }
  } catch (error) {
    result.code = 400;
    result.error = error;
  }

  return result;
};
const addUserArtist = async (req) => {
  return new Promise((resolve, reject) => {
    const result = { data: null };
    passport.authenticate("local-signup", async (err, user, info) => {
      if (err) {
        throw err;
      }
      if (!user) {
        result.code = 205; // Email is already taken
        resolve(result);
      } else {
        // Registration successful
        result.data = user;
        result.code = 201;
        resolve(result);
      }
    })(req);
  });
};

const updateUserArtist = async (req) => {
  const result = { data: null };
  const {
    id,
    email,
    username,
    artist_categories,
    first_name,
    last_name,
    city,
    state,
    country,
    concert_artist,
    visibility,
    chat,
    bio,
    profile_img,
    profile_cover,
    verified,
    badges,
    gallery_imgs,
    music_videos,
    music,
    facebook,
    twitter,
    sportify,
    instagram,
    youtube,
    website,
    blocked_user,
    followers,
    following,
    likes,
    liked,
    votes,
    playlist,
    blocked,
    wallet_id,
    status,
  } = req.body;
  const filter = { _id: id };
  const UserArtist = await userArtistsSchema.updateOne(
    filter,
    {
      email: email,
      username: username,
      artist_categories: artist_categories,
      first_name: first_name,
      last_name: last_name,
      city: city,
      state: state,
      country: country,
      concert_artist: concert_artist,
      visibility: visibility,
      chat: chat,
      bio: bio,
      profile_img: profile_img,
      profile_cover: profile_cover,
      verified: verified,
      badges: badges,
      gallery_imgs: gallery_imgs,
      music_videos: music_videos,
      music: music,
      facebook: facebook,
      twitter: twitter,
      sportify: sportify,
      instagram: instagram,
      youtube: youtube,
      website: website,
      blocked_user: blocked_user,
      followers: followers,
      following: following,
      likes: likes,
      liked: liked,
      votes: votes,
      playlist: playlist,
      blocked: blocked,
      wallet_id: wallet_id,
      status: status,
    },
    {
      where: {
        _id: id,
      },
    }
  );
  if (UserArtist) {
    result.data = UserArtist;
    result.code = 202;
  } else {
    result.code = 204;
  }
  return result;
};

const getAllUserArtist = async (req) => {
  const result = { data: null };
  const UserArtist = await userArtistsSchema.find();
  if (UserArtist) {
    let allUserArtist = UserArtist.map((UserArtistData, key) => {
      return new Promise(async (resolve, reject) => {
        let artistCategoriesInfo = await artistCategoriesSchema.find({
          _id: { $in: UserArtistData.artist_categories },
        });
        if (artistCategoriesInfo) {
          UserArtist[key].artist_categories = artistCategoriesInfo;
        }
        let genresInfo = await genreSchema.find({
          _id: { $in: UserArtistData.genres },
        });
        if (genresInfo) {
          UserArtist[key].genres = genresInfo;
        }
        return resolve();
      });
    });
    await Promise.all(allUserArtist);

    result.data = UserArtist;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
};

const getUserArtist = async (req) => {
  const result = { data: null };
  const id = req.params.id;

  try {
    const UserArtist = await userArtistsSchema.findById(id);
    let artistCategoriesInfo = await artistCategoriesSchema.find({
      _id: { $in: UserArtist.artist_categories },
    });
    if (artistCategoriesInfo) {
      UserArtist.artist_categories = artistCategoriesInfo;
    }
    let genresInfo = await genreSchema.find({
      _id: { $in: UserArtist.genres },
    });
    if (genresInfo) {
      UserArtist.genres = genresInfo;
    }

    if (UserArtist) {
      result.data = UserArtist;
      result.code = 200;
    } else {
      result.code = 204;
    }
  } catch (error) {
    result.code = 204;
    result.error = error;
  }

  return result;
};

const deleteUserArtist = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const UserArtist = await userArtistsSchema.findByIdAndRemove(id);
  if (UserArtist) {
    result.data = UserArtist;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
};

module.exports = {
  artistLogin,
  forgotPasswordArtist,
  updateUserArtistSpecificColumn,
  addUserArtist,
  updateUserArtist,
  getAllUserArtist,
  getUserArtist,
  deleteUserArtist,
};
