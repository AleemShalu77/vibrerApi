const appUsersSchema = require("../../model/app_users");
const adminUsersSchema = require("../../model/admin_users");
const artistCategoriesSchema = require("../../model/artist_categories");
const genreSchema = require("../../model/genre");
const contestSchema = require("../../model/contests");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const { PROFILE_COVER_URL, GALLERY_IMAGE_URL } = require("../../config/index");
const nodemailer = require("nodemailer");
const sharp = require("sharp");
const heicConvert = require("heic-convert");
const path = require("path");
const fs = require("fs");
const https = require("https");
const AWS = require("aws-sdk");
require("dotenv").config();
const {
  getMessage,
  getForgotPassword,
  generateRandomToken,
  uploadFileToR2,
  getFileFromR2,
} = require("../../utils/helper");
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const transporter = nodemailer.createTransport({
  host: "smtp.ionos.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_FROM, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});

const generateUniqueFileName = () => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8); // Generates a random string of length 6
  const uniqueFileName = `${timestamp}_${randomString}`;
  return uniqueFileName;
};

class UniqueUsernameGenerator {
  async generateUsernameByFullName(fullName) {
    const baseUsername = fullName
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase()
      .slice(0, 10);

    let username;
    let suffix = 0;
    do {
      username = baseUsername + (suffix > 0 ? suffix : "");
      suffix++;
    } while (await this.usernameExists(username));

    return username;
  }

  async generateUsername(firstname, lastname) {
    const baseUsername = `${firstname.slice(0, 3).toLowerCase()}${lastname
      .slice(0, 3)
      .toLowerCase()}`;

    let username;
    do {
      username = baseUsername + Math.floor(Math.random() * 900 + 100);
    } while (await this.usernameExists(username));

    return username;
  }

  async usernameExists(username) {
    const existingUser = await appUsersSchema.findOne({ username });
    return existingUser !== null;
  }
}

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
        const existingUser = await appUsersSchema.findOne({ email });

        if (existingUser) {
          return done(null, false, { message: "Email is already taken." });
        }

        const hashedPassword = await bcryptjs.hashSync(password, 10);
        const verification_token = generateRandomToken(50);

        const newUser = await appUsersSchema.create({
          user_type: req.body.user_type,
          email,
          password: hashedPassword,
          username: req.body.username,
          artist_categories: req.body.artist_categories,
          name: {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
          },
          full_name: req.body.full_name,
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
          verification: false,
          verification_token: verification_token,
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
        if (newUser) {
          const message = await getEmailVerification(email, verification_token);
          const messageData = await getMessage(
            message,
            email,
            process.env.EMAIL_FROM,
            "Vibrer Email Verification"
          );

          // Assuming you have a function to send the verification email
          const send = await transporter.sendMail(messageData);

          return done(null, newUser);
        } else {
          return done(null, false, { message: "User registration failed." });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "local-signup-register-user",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const existingUser = await appUsersSchema.findOne({ email });

        if (existingUser) {
          return done(null, false, { message: "Email is already taken." });
        }

        const hashedPassword = await bcryptjs.hashSync(password, 10);
        const verification_token = generateRandomToken(50);
        const updatedUsername =
          await new UniqueUsernameGenerator().generateUsernameByFullName(
            req.body.full_name
          );

        const newUser = await appUsersSchema.create({
          user_type: req.body.user_type,
          email,
          password: hashedPassword,
          username: updatedUsername,
          artist_categories: req.body.artist_categories,
          full_name: req.body.full_name,
          gender: req.body.gender,
          date_of_birth: req.body.date_of_birth,
          city: req.body.city,
          country: req.body.country,
          concert_artist: req.body.concert_artist,
          visibility: "Public",
          bio: req.body.bio,
          profile_img: req.body.profile_img,
          profile_cover: req.body.profile_cover,
          verified: req.body.verified,
          verification: true,
          verification_token: verification_token,
          genres: req.body.genres,
          link: {
            facebook: req.body.facebook,
            twitter: req.body.twitter,
            instagram: req.body.instagram,
            youtube: req.body.youtube,
            website: req.body.website,
          },
          status: "Active",
        });
        if (newUser) {
          return done(null, newUser);
        } else {
          return done(null, false, { message: "User registration failed." });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "local-registerappUser",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const { confirmPassword } = req.body;

        // Validate password and confirmPassword
        if (password !== confirmPassword) {
          return done(null, false, { message: "Passwords do not match." });
        }

        const existingUser = await appUsersSchema.findOne({ email });

        if (existingUser) {
          return done(null, false, { message: "Email is already taken." });
        }

        const hashedPassword = await bcryptjs.hashSync(password, 10);
        const verification_token = generateRandomToken(50);

        const newUser = await appUsersSchema.create({
          user_type: req.body.user_type,
          email,
          password: hashedPassword,
          verification: false,
          verification_token: verification_token,
          status: "Active",
        });

        if (newUser) {
          const message = await getEmailVerificationappUser(
            email,
            verification_token
          );
          const messageData = await getMessage(
            message,
            email,
            process.env.EMAIL_FROM,
            "Vibrer Email Verification"
          );

          // Assuming you have a function to send the verification email
          const send = await transporter.sendMail(messageData);

          return done(null, newUser);
        } else {
          return done(null, false, { message: "User registration failed." });
        }
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
        const user = await appUsersSchema.findOne({ email });

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }
        // if (!user.verification) {
        //   return done(null, false, { message: "Invalid email or password" });
        // }
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
    const user = await appUsersSchema.findById(id);
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

// const forgotPasswordArtist = async (req) => {
//   const result = { data: null };
//   const { email, confirmPassword } = req.body;
//   if (req.body.password != confirmPassword) {
//     result.code = 2016;
//     return result;
//   }
//   // const pswd = await bcrypt.genSalt(10);
//   // const password = await bcrypt.hash(req.body.password, pswd);
//   const password = await bcryptjs.hashSync(req.body.password, 10);
//   const user = await appUsersSchema.findOne({ email });
//   if (user) {
//     const reset = await appUsersSchema.updateOne(
//       { email: email },
//       {
//         password: password,
//       }
//     );
//     result.data = reset;
//     result.code = 2015;
//   } else {
//     result.code = 2017;
//   }
//   return result;
// };

const forgotPassword = async (req) => {
  let result = { data: null };
  const { email } = req.body;
  const verification_token = generateRandomToken(50);
  const message = await getForgotPasswordappUser(email, verification_token);
  const messageData = await getMessage(
    message,
    email,
    process.env.EMAIL_FROM,
    "Forgot Password"
  );

  try {
    const admin = await appUsersSchema.findOne({ email: email });

    if (admin) {
      try {
        // await sendGridMail.send(messageData);
        const send = await transporter.sendMail(messageData);
        if (send) {
          const expiryDate = new Date(Date.now() + 3600000); // Set the expiry to one hour from now
          admin.forgotPasswordToken = {
            token: verification_token,
            expiresAt: expiryDate,
          };
          await admin.save();
          result.code = 2024;
        } else {
          result.code = 2025;
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          console.error(error.response.body);
        }
        result.code = 2025;
      }
    } else {
      result.code = 2017;
    }
  } catch (error) {
    // Handle the error appropriately
    console.error("Error occurred:", error);
    result.code = 2017;
  }
  return result;
};

const resetPassword = async (req) => {
  let result = { data: null };
  const { token, confirmPassword } = req.body;

  if (req.body.password !== confirmPassword) {
    result.code = 2016;
    return result;
  }

  const password = await bcryptjs.hashSync(req.body.password, 10);

  try {
    const admin = await appUsersSchema.findOne({
      "forgotPasswordToken.token": token,
    });

    if (admin) {
      const currentTimestamp = new Date();
      if (admin.forgotPasswordToken.expiresAt < currentTimestamp) {
        result.code = 2018; // Token has expired
      } else {
        const reset = await appUsersSchema.updateOne(
          { "forgotPasswordToken.token": token },
          {
            $set: { password: password },
            $unset: { forgotPasswordToken: 1 },
          }
        );

        result.data = reset;
        result.code = 2015; // Password reset success
      }
    } else {
      result.code = 2017; // Invalid token
    }
  } catch (error) {
    console.error("Error:", error);
    result.code = 500; // Handle error cases appropriately
  }

  return result;
};

const verificationCode = async (req) => {
  let result = { data: null };
  const { token } = req.body;

  try {
    const adminUser = await appUsersSchema.findOne({
      verification_token: token,
      verification: false,
    });
    if (adminUser) {
      const updateToken = await appUsersSchema.updateOne(
        { _id: adminUser._id },
        { $set: { verification: true } }
      );

      if (updateToken) {
        result.code = 2023;
      } else {
        result.code = 500;
      }
    } else {
      result.code = 2022;
    }
  } catch (error) {
    console.error("Error checking verification code:", error);
    result.code = 500;
  }

  return result;
};

const updateappUserSpecificColumn = async (req) => {
  const result = { data: null };
  const { id, column, value } = req.body;

  try {
    const appUser = await appUsersSchema.findById(id);

    if (appUser) {
      // Use an object to specify the field you want to update dynamically
      const updateObject = {};
      updateObject[column] = value;

      // Update the specified field
      const reset = await appUsersSchema.updateOne({ _id: id }, updateObject);
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

const addappUser = async (req) => {
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

const addNewAppUser = async (req) => {
  return new Promise((resolve, reject) => {
    const result = { data: null };
    passport.authenticate(
      "local-signup-register-user",
      async (err, user, info) => {
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
      }
    )(req);
  });
};

const registerappUser = async (req) => {
  return new Promise((resolve, reject) => {
    const result = { data: null };

    passport.authenticate("local-registerappUser", async (err, user, info) => {
      try {
        if (err) {
          throw err;
        }
        if (!user) {
          result.code = 205; // Email is already taken
          resolve(result);
        } else {
          // Registration successful
          let payload = {
            id: user._id,
            mobile: user.email,
            role: user.user_type,
          };

          let options = { expiresIn: "72h" };
          let token = jwt.sign(payload, JWT_SECRET, options);

          const modifiedUser = {
            _id: user._id,
            token: token,
            email: user.email,
            user_type: user.user_type,
          };

          // Update the result.data before resolving the promise
          result.data = modifiedUser;
          result.code = 201;

          // Resolve the promise with the updated result
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    })(req);
  });
};

const updateappUser = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const {
    email,
    username,
    artist_categories,
    first_name,
    last_name,
    full_name,
    gender,
    date_of_birth,
    city,
    country,
    concert_artist,
    visibility,
    bio,
    profile_img,
    profile_cover,
    genres,
    facebook,
    twitter,
    instagram,
    youtube,
    website,
  } = req.body;

  try {
    const filter = { _id: payload.id };
    const existingUser = await appUsersSchema.findById(payload.id);
    let updatedUsername;

    if (!existingUser.username && !req.body.username) {
      if (req.body.first_name && req.body.last_name) {
        updatedUsername = await new UniqueUsernameGenerator().generateUsername(
          req.body.first_name,
          req.body.last_name
        );
      } else if (req.body.full_name) {
        updatedUsername =
          await new UniqueUsernameGenerator().generateUsernameByFullName(
            req.body.full_name
          );
      }
    } else {
      updatedUsername = req.body.username || existingUser.username;
    }

    if (req.body.username) {
      const existingUsernameOther = await appUsersSchema.findOne({
        username: req.body.username,
        _id: { $ne: payload.id },
      });
      if (existingUsernameOther) {
        result.code = 2038;
        return result;
      }
    }

    const update = {
      email,
      username: updatedUsername.toLowerCase(),
      artist_categories,
      name: {
        first_name,
        last_name,
      },
      full_name,
      gender,
      date_of_birth,
      city,
      country,
      concert_artist,
      visibility,
      bio,
      profile_img,
      profile_cover,
      genres,
      link: {
        facebook,
        twitter,
        instagram,
        youtube,
        website,
      },
    };

    const updatedUser = await appUsersSchema.updateOne(filter, update);

    if (updatedUser) {
      // if(req.)
      // const uploadProfileImage = uploadProfileCoverImage();
      // const uploadProfileImage = uploadProfileCoverImage();
      result.data = updatedUser;
      result.code = 202;
    } else {
      result.code = 2017;
    }
  } catch (error) {
    console.error("Error updating user:", error);
    result.code = 500;
  }

  return result;
};

const getAllappUser = async (req) => {
  const result = { data: null };
  let { page, limit, search, draw } = req.query;

  // Set default values if page or limit is not provided
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  // Construct your query based on search parameters
  const query = {
    $and: [
      {
        $or: [
          { "account_deleted.is_deleted": { $ne: true } },
          { account_deleted: { $exists: false } },
        ],
      },
    ],
  };

  if (search) {
    const searchRegex = new RegExp(search, "i"); // Case-insensitive search regex
    query.$and.push({
      $or: [
        { full_name: searchRegex },
        { email: searchRegex },
        { user_type: searchRegex },
        { country: searchRegex },
        // Add more fields for search as needed
      ],
    });
  }

  const totalDocuments = await appUsersSchema.countDocuments(query);
  const totalPages = Math.ceil(totalDocuments / limit);

  // Ensure page is within valid range
  page = Math.min(page, totalPages);
  page = Math.max(page, 1); // Ensure page is at least 1

  // Fetch appUsers based on query, skipping appropriate number of documents based on pagination
  const skipValue = (page - 1) * limit; // Calculate skip value
  const appUser = await appUsersSchema
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skipValue >= 0 ? skipValue : 0) // Ensure skip value is non-negative
    .limit(limit);

  if (appUser) {
    // Prepare the response data
    result.code = 200;
    result.data = {
      draw,
      data: appUser,
      page,
      limit,
      recordsFiltered: totalDocuments,
      recordsTotal: totalDocuments, // totalRecords is the same as recordsTotal in DataTables
    };
  } else {
    result.code = 204; // No Content
  }

  return result;
};

const getappUser = async (req) => {
  const result = { data: null };
  const id = req.params.id;

  try {
    const appUser = await appUsersSchema.findById(id);
    let artistCategoriesInfo = await artistCategoriesSchema.find({
      _id: { $in: appUser.artist_categories },
    });
    if (artistCategoriesInfo) {
      appUser.artist_categories = artistCategoriesInfo;
    }
    let genresInfo = await genreSchema.find({
      _id: { $in: appUser.genres },
    });
    if (genresInfo) {
      appUser.genres = genresInfo;
    }

    if (appUser) {
      result.data = appUser;
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

const checkUsername = async (req) => {
  const result = { data: null };
  const { username } = req.body;
  const payload = req.decoded;

  try {
    const appUser = await appUsersSchema.findOne({
      username: username.toLowerCase(),
      _id: { $ne: payload.id },
    });

    if (appUser) {
      result.data = { is_exists: true };
      result.code = 205;
    } else {
      result.data = { is_exists: false };
      result.code = 2037;
    }
  } catch (error) {
    console.error("Error checking username:", error);
    result.code = 2028;
    result.error = error.message;
  }

  return result;
};

const getappUserProfile = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const id = payload.id;

  try {
    const appUser = await appUsersSchema.findById(id);
    let artistCategoriesInfo = await artistCategoriesSchema.find({
      _id: { $in: appUser.artist_categories },
    });
    if (artistCategoriesInfo) {
      appUser.artist_categories = artistCategoriesInfo;
    }
    let genresInfo = await genreSchema.find({
      _id: { $in: appUser.genres },
    });
    if (genresInfo) {
      appUser.genres = genresInfo;
    }

    if (appUser) {
      result.data = appUser;
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

const deleteappUser = async (req) => {
  const result = { data: null };
  const { user_id, user_type } = req.body;

  try {
    const user = await appUsersSchema.findById(user_id);
    if (user && user.account_deleted && user.account_deleted.is_deleted) {
      result.code = 2044;
      return result;
    }

    let accountDeleted = null;
    if (user_type === "admin") {
      const adminData = await adminUsersSchema.findById(req.decoded.id);
      if (!adminData) {
        result.code = 2043;
        return result;
      }
      const admin_email = adminData.email;
      const admin_name = `${adminData.name.first_name} ${adminData.name.last_name}`;
      accountDeleted = {
        is_deleted: true,
        deleted_by: {
          user_type: "admin",
          admin_email: admin_email,
          admin_name: admin_name,
        },
        deletedAt: new Date(),
      };
    } else {
      accountDeleted = {
        is_deleted: true,
        deleted_by: {
          user_type: "self",
        },
        deletedAt: new Date(),
      };
    }

    const updatedUser = await appUsersSchema.findOneAndUpdate(
      { _id: user_id },
      {
        $unset: {
          email: "",
          password: "",
          username: "",
          artist_categories: "",
          name: "",
          gender: "",
          date_of_birth: "",
          city: "",
          country: "",
          concert_artist: "",
          visibility: "",
          bio: "",
          profile_img: "",
          profile_cover: "",
          verified: "",
          verification: "",
          verification_token: "",
          forgotPasswordToken: "",
          genres: "",
          gallery: "",
          link: "",
          favourites: "",
          status: "",
        },
        $set: {
          account_deleted: accountDeleted,
          full_name: "user_deleted",
        },
      },
      {
        new: true,
        select: {
          _id: 1,
          user_type: 1,
          full_name: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      }
    );

    if (updatedUser) {
      await contestSchema.updateMany(
        { "participates.user_id": user_id },
        {
          $pull: {
            participates: { user_id: user_id },
          },
        }
      );

      await contestSchema.updateMany(
        { "participates.votes.user_id": user_id },
        {
          $pull: {
            "participates.$[].votes": { user_id: user_id },
          },
        }
      );
      result.data = updatedUser;
      result.code = 203;
    } else {
      result.code = 204;
    }
  } catch (error) {
    console.error("Error while deleting appUser:", error);
    result.code = 500;
  }

  return result;
};

const profileCoverImage = async (req) => {
  const result = { data: null };
  const payload = req.decoded;

  if (!req.file) {
    result.code = 2029;
    return result;
  }

  const file = req.file;
  const newFileName = generateUniqueFileName();

  const tempPath = file.path;
  const targetPath = path.join(
    __dirname,
    `../../public/profileCoverImage/${newFileName}.webp`
  );
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension === ".heic") {
    const inputBuffer = fs.readFileSync(tempPath);
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: "JPEG",
      quality: 1,
    });
    fs.writeFileSync(tempPath, outputBuffer);
  }

  try {
    await sharp(tempPath)
      .resize(800, null)
      .webp({ quality: 100 })
      .toFile(targetPath);
  } catch (error) {
    console.error("Failed to convert image:", error);
    result.code = 2031;
    return result;
  }

  fs.unlink(tempPath, () => {});
  const imagePath = `${PROFILE_COVER_URL}${newFileName}.webp`;

  if (req.body.type) {
    const user = await appUsersSchema.findById(payload.id);
    let oldImagePath = "";
    if (req.body.type === "profile_img") {
      oldImagePath = user.profile_img;
    } else if (req.body.type === "profile_cover") {
      oldImagePath = user.profile_cover;
    }

    if (oldImagePath && oldImagePath.trim() !== "") {
      oldImagePath = oldImagePath.split("/").pop();
      const oldImageFilePath = path.join(
        __dirname,
        `../../public/profileCoverImage/${oldImagePath}`
      );
      fs.unlinkSync(oldImageFilePath);
    }
    let updateFields = {};

    if (req.body.type === "profile_img") {
      updateFields = { profile_img: imagePath };
    } else if (req.body.type === "profile_cover") {
      updateFields = { profile_cover: imagePath };
    }
    await appUsersSchema.findByIdAndUpdate(payload.id, updateFields, {
      new: true,
    });
  }

  result.data = imagePath;
  result.code = 2030;

  return result;
};

const uploadProfileCoverImage = async (file, type, user_id) => {
  const result = { data: null };

  if (file) {
    result.code = 2029;
    return result;
  }

  const newFileName = generateUniqueFileName();

  const tempPath = file.path;
  const targetPath = path.join(
    __dirname,
    `../../public/profileCoverImage/${newFileName}.webp`
  );
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension === ".heic") {
    const inputBuffer = fs.readFileSync(tempPath);
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: "JPEG",
      quality: 1,
    });
    fs.writeFileSync(tempPath, outputBuffer);
  }

  try {
    await sharp(tempPath)
      .resize(800, null)
      .webp({ quality: 100 })
      .toFile(targetPath);
  } catch (error) {
    console.error("Failed to convert image:", error);
    result.code = 2031;
    return result;
  }

  fs.unlink(tempPath, () => {});
  const imagePath = `${PROFILE_COVER_URL}${newFileName}.webp`;

  if (req.body.type) {
    const user = await appUsersSchema.findById(user_id);
    let oldImagePath = "";
    if (type === "profile_img") {
      oldImagePath = user.profile_img;
    } else if (type === "profile_cover") {
      oldImagePath = user.profile_cover;
    }

    if (oldImagePath && oldImagePath.trim() !== "") {
      oldImagePath = oldImagePath.split("/").pop();
      const oldImageFilePath = path.join(
        __dirname,
        `../../public/profileCoverImage/${oldImagePath}`
      );
      fs.unlinkSync(oldImageFilePath);
    }
    let updateFields = {};

    if (req.body.type === "profile_img") {
      updateFields = { profile_img: imagePath };
    } else if (req.body.type === "profile_cover") {
      updateFields = { profile_cover: imagePath };
    }
    await appUsersSchema.findByIdAndUpdate(user_id, updateFields, {
      new: true,
    });
  }

  result.data = imagePath;
  result.code = 2030;

  return result;
};

const uploadGalleryImage = async (req) => {
  const result = { data: null };
  const payload = req.decoded;

  if (!req.file) {
    result.code = 2029;
    return result;
  }

  const file = req.file;
  const newFileName = generateUniqueFileName();

  const tempPath = file.path;
  const targetPath = path.join(
    __dirname,
    `../../public/galleryImages/${newFileName}.webp`
  );
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension === ".heic") {
    const inputBuffer = fs.readFileSync(tempPath);
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: "JPEG",
      quality: 1,
    });
    fs.writeFileSync(tempPath, outputBuffer);
  }

  try {
    await sharp(tempPath)
      .resize(800, null)
      .webp({ quality: 100 })
      .toFile(targetPath);
  } catch (error) {
    console.error("Failed to convert image:", error);
    result.code = 2028;
    return result;
  }

  fs.unlink(tempPath, () => {});

  const imagePath = `${GALLERY_IMAGE_URL}${newFileName}.webp`;

  try {
    const updatedUser = await appUsersSchema.findByIdAndUpdate(
      payload.id,
      {
        $push: {
          gallery: {
            title: "Image Title",
            media_url: imagePath,
            status: "active",
          },
        },
      },
      { new: true }
    );
    if (updatedUser) {
      result.data = imagePath;
      result.code = 2030;
    } else {
    }
  } catch (updateError) {
    console.error("Error updating user with gallery image:", updateError);
    result.code = 2028;
  }

  return result;
};

// const uploadGalleryImage = async (req) => {
//   const result = { data: null };
//   const payload = req.decoded;

//   if (!req.file) {
//     result.code = 2029;
//     return result;
//   }

//   const file = req.file;
//   const newFileName = generateUniqueFileName();
//   const targetFileName = `${newFileName}.webp`; // The file will be saved as a .webp
//   const mimeType = "image/webp"; // MIME type for the webp image

//   const tempPath = file.path;
//   const extension = path.extname(file.originalname).toLowerCase();

//   if (extension === ".heic") {
//     // Convert HEIC to JPEG first
//     const inputBuffer = fs.readFileSync(tempPath);
//     const outputBuffer = await heicConvert({
//       buffer: inputBuffer,
//       format: "JPEG",
//       quality: 1,
//     });
//     fs.writeFileSync(tempPath, outputBuffer);
//   }

//   let uploadBuffer;
//   try {
//     // Process the image with sharp and get buffer for upload
//     uploadBuffer = await sharp(tempPath)
//       .resize(800, null) // Resizing the image
//       .webp({ quality: 100 }) // Converting to webp
//       .toBuffer();
//   } catch (error) {
//     console.error("Failed to process image:", error);
//     result.code = 2028;
//     return result;
//   } finally {
//     // Delete the temporary file
//     fs.unlinkSync(tempPath);
//   }

//   try {
//     // Upload the processed image buffer to Cloudflare R2
//     const uploadResponse = await uploadFileToR2(
//       uploadBuffer,
//       targetFileName,
//       mimeType
//     );
//     console.log(uploadResponse);
//     // The URL to access the image on Cloudflare R2, adjust as necessary
//     const imagePath = `${endpoint}/${uploadResponse.Key}`;

//     // Update the user schema with the new image path
//     const updatedUser = await appUsersSchema.findByIdAndUpdate(
//       payload.id,
//       {
//         $push: {
//           gallery: {
//             title: "Image Title",
//             media_url: imagePath,
//             status: "active",
//           },
//         },
//       },
//       { new: true }
//     );

//     if (updatedUser) {
//       result.data = imagePath;
//       result.code = 2030;
//     } else {
//       // Handle the case where the user is not found or not updated
//       result.code = 2027; // You should define an appropriate error code for this case
//     }
//   } catch (uploadError) {
//     console.error("Error uploading image to R2:", uploadError);
//     result.code = 2028;
//   }

//   return result;
// };

const deleteGalleryImage = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const galleryImageId = req.params.id;

  try {
    const user = await appUsersSchema.findById(payload.id);

    const galleryImageIndex = user.gallery.findIndex(
      (image) => String(image._id) === String(galleryImageId)
    );

    if (galleryImageIndex === -1) {
      result.code = 204;
      return result;
    }

    const fileName = user.gallery[galleryImageIndex].media_url.split("/").pop();

    const absoluteFilePath = path.join(
      __dirname,
      `../../public/galleryImages/${fileName}`
    );

    await fs.promises.unlink(absoluteFilePath);

    user.gallery.splice(galleryImageIndex, 1);

    await user.save();

    result.code = 203;
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    result.code = 500;
  }

  return result;
};

const removeProfileCoverImage = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const { type } = req.body;

  try {
    const user = await appUsersSchema.findById(payload.id);

    let fileName = user[type];
    if (fileName && fileName.trim() !== "") {
      fileName = fileName.split("/").pop();

      const absoluteFilePath = path.join(
        __dirname,
        `../../public/profileCoverImage/${fileName}`
      );

      await fs.promises.unlink(absoluteFilePath);
    }

    user[type] = "";

    await user.save();

    result.code = 203;
  } catch (error) {
    console.error(`Error deleting ${type} image:`, error);
    result.code = 500;
  }

  return result;
};

module.exports = {
  artistLogin,
  // forgotPasswordArtist,
  updateappUserSpecificColumn,
  addappUser,
  registerappUser,
  updateappUser,
  getAllappUser,
  getappUser,
  deleteappUser,
  forgotPassword,
  resetPassword,
  verificationCode,
  profileCoverImage,
  getappUserProfile,
  uploadGalleryImage,
  deleteGalleryImage,
  checkUsername,
  removeProfileCoverImage,
  addNewAppUser,
  uploadProfileCoverImage,
};
