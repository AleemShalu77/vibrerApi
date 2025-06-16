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
const exceljs = require("exceljs");
require("dotenv").config();
const {
  getMessage,
  getForgotPassword,
  generateRandomToken,
  uploadFileToR2,
  getFileFromR2,
  isValidEmail,
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
  "local-appUser-register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        email = email.toLowerCase();
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
          userType: req.body.user_type,
          email,
          password: hashedPassword,
          verification: false,
          verificationToken: verification_token,
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
  "local-appUser-login",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        email = email.toLowerCase();
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

const login = async (req) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local-appUser-login", (err, user, info) => {
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

const verifyEmail = async (req) => {
  let result = { data: null };
  const { token } = req.body;

  try {
    const adminUser = await appUsersSchema.findOne({
      verificationToken: token,
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

const registerAppUser = async (req) => {
  return new Promise((resolve, reject) => {
    const result = { data: null };

    passport.authenticate("local-appUser-register", async (err, user, info) => {
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
      artistCategories: artist_categories,
      name: {
        firstName: first_name,
        lastName: last_name,
      },
      fullName: full_name,
      gender,
      date_of_birth,
      city,
      country,
      concertArtist: concert_artist,
      visibility,
      bio,
      profileImg: profile_img,
      profileCover: profile_cover,
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
      _id: { $in: appUser.artistCategories },
    });
    if (artistCategoriesInfo) {
      appUser.artistCategories = artistCategoriesInfo;
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
    if (user && user.accountDeleted && user.accountDeleted.isDeleted) {
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
      const admin_name = `${adminData.name.firstName} ${adminData.name.lastLame}`;
      accountDeleted = {
        isDeleted: true,
        deletedBy: {
          userType: "admin",
          adminEmail: admin_email,
          adminName: admin_name,
        },
        deletedAt: new Date(),
      };
    } else {
      accountDeleted = {
        isDeleted: true,
        deletedBy: {
          userType: "self",
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
          artistCategories: "",
          name: "",
          gender: "",
          date_of_birth: "",
          city: "",
          country: "",
          concert_artist: "",
          visibility: "",
          bio: "",
          profileImg: "",
          profileCover: "",
          verified: "",
          verification: "",
          verificationToken: "",
          forgotPasswordToken: "",
          genres: "",
          gallery: "",
          link: "",
          favourites: "",
          status: "",
        },
        $set: {
          accountDeleted: accountDeleted,
          fullName: "user_deleted",
        },
      },
      {
        new: true,
        select: {
          _id: 1,
          userType: 1,
          fullName: 1,
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
      oldImagePath = user.profileImg;
    } else if (req.body.type === "profile_cover") {
      oldImagePath = user.profileCover;
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
      updateFields = { profileImg: imagePath };
    } else if (req.body.type === "profile_cover") {
      updateFields = { profileCover: imagePath };
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
      oldImagePath = user.profileImg;
    } else if (type === "profile_cover") {
      oldImagePath = user.profileCover;
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
      updateFields = { profileImg: imagePath };
    } else if (req.body.type === "profile_cover") {
      updateFields = { profileCover: imagePath };
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
            mediaUrl: imagePath,
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

    const fileName = user.gallery[galleryImageIndex].mediaUrl.split("/").pop();

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

const bulkUserUpload = async (req) => {
  const result = { data: { inserted: [], duplicates: [], errors: [] } };
  const payload = req.decoded;

  if (!req.file) {
    result.code = 2029;
    return result;
  }

  const password = "ABCD123456"; // Default password for all users (change this)
  const hashedPassword = await bcryptjs.hashSync(password, 10); // Hash the password
  const verification_token = generateRandomToken(50);

  const workbook = new exceljs.Workbook();
  await workbook.xlsx.readFile(req.file.path);
  const worksheet = workbook.getWorksheet(1);

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
    const row = worksheet.getRow(rowNumber);
    const email = row.getCell(3).value.toLowerCase();

    // Validate email format
    if (!isValidEmail(email)) {
      result.data.errors.push({ email, error: "Invalid email format" });
      continue;
    }

    // Check if the email already exists in the database
    const existingUser = await appUsersSchema.findOne({ email });
    if (existingUser) {
      // If the email already exists, add it to the duplicates array
      result.data.duplicates.push({ email });
      continue;
    }

    let updatedUsername =
      await new UniqueUsernameGenerator().generateUsernameByFullName(
        row.getCell(1).value
      );

    // If the email does not exist and is valid, prepare the user data for insertion
    const userData = {
      user_type: "Fan",
      username: updatedUsername,
      full_name: row.getCell(1).value,
      date_of_birth: row.getCell(2).value,
      email,
      verification: true,
      verification_token: verification_token,
      city: row.getCell(4).value,
      country: row.getCell(5).value,
      gender: row.getCell(6).value,
      password: hashedPassword,
      bio: "",
      status: "Active",
      link: {
        facebook: "",
        instagram: "",
        youtube: "",
        twitter: "",
        website: "",
      },
    };

    try {
      const newUser = await appUsersSchema.create(userData);
      result.data.inserted.push(newUser);
    } catch (error) {
      result.data.errors.push({ email, error: error.message });
    }
  }
  result.code = 201;
  return result;
};

const addRemoveBlockUser = async (req) => {
  const result = { data: null };
  const { user_id } = req.body;
  const payload = req.decoded; // assuming this contains the authenticated user's ID

  try {
    const appUserData = await appUsersSchema.findById(user_id);

    if (!appUserData) {
      result.code = 2017;
      return result;
    }

    const user = await appUsersSchema.findById(payload.id);

    if (!user) {
      result.code = 2017;
      return result;
    }

    const isUserIDBlockedExists = appUserData.blocked_users.some(
      (blocked) => String(blocked) === String(payload.id)
    );

    if (isUserIDBlockedExists) {
      result.code = 2049;
      return result;
    }

    const isUserBlocked = user.blocked_users.some(
      (blocked_user) => String(blocked_user) === String(user_id)
    );

    if (isUserBlocked) {
      user.blocked_users = user.blocked_users.filter(
        (blocked_user) => String(blocked_user) !== String(user_id)
      );
      appUserData.blocked = user.blocked.filter(
        (blocked) => String(blocked) !== String(payload.id)
      );
      result.code = 2048;
    } else {
      user.blocked_users.push(user_id);
      appUserData.blocked.push(payload.id);
      result.code = 2050;
    }

    const updatedUserData = await user.save();
    await appUserData.save();

    // result.data = updatedUserData;
  } catch (error) {
    console.error("Error:", error);
    result.code = 500; // Internal Server Error
    result.message = "Error processing the request";
  }

  return result;
};

const getBlockedUsers = async (req) => {
  const result = { data: null };
  const payload = req.decoded;

  try {
    // Find the user by their ID
    const user = await appUsersSchema.findById(payload.id);

    if (!user) {
      result.code = 2017; // User not found
      return result;
    }

    // Extract blocked users data
    const blockedUsers = user.blocked_users;

    // Fetch detailed information for each blocked user
    const detailedBlockedUsers = [];
    for (const blockedUserId of blockedUsers) {
      const userData = await appUsersSchema.findById(blockedUserId);

      if (userData) {
        detailedBlockedUsers.push({
          _id: userData._id,
          email: userData.email,
          full_name: userData.full_name,
          name: userData.name,
          profileImg: userData.profileImg,
          profileCover: userData.profileCover,
          username: userData.username,
          city: userData.city,
          country: userData.country,
          date_of_birth: userData.date_of_birth,
          gender: userData.gender,
          verified: userData.verified,
        });
      }
    }

    if (detailedBlockedUsers.length > 0) {
      result.data = detailedBlockedUsers;
      result.code = 200; // Success
    } else {
      result.code = 204; // No content
    }
  } catch (error) {
    console.error("Error:", error);
    result.code = 500; // Internal Server Error
    result.message = "Error processing the request";
  }

  return result;
};

const addRemoveFollowUser = async (req) => {
  const result = { data: null };
  const { user_id } = req.body;
  const payload = req.decoded; // assuming this contains the authenticated user's ID

  try {
    const appUserData = await appUsersSchema.findById(user_id);

    if (!appUserData) {
      result.code = 2017;
      return result;
    }

    const user = await appUsersSchema.findById(payload.id);

    if (!user) {
      result.code = 2017;
      return result;
    }

    const isUserFollowing = user.following.some(
      (following) => String(following) === String(user_id)
    );

    if (isUserFollowing) {
      user.following = user.following.filter(
        (following) => String(following) !== String(user_id)
      );
      appUserData.followers = user.followers.filter(
        (followers) => String(followers) !== String(payload.id)
      );
      result.code = 2052;
    } else {
      user.following.push(user_id);
      appUserData.followers.push(payload.id);
      result.code = 2051;
    }

    const updatedUserData = await user.save();
    await appUserData.save();

    // result.data = updatedUserData;
  } catch (error) {
    console.error("Error:", error);
    result.code = 500; // Internal Server Error
    result.message = "Error processing the request";
  }

  return result;
};

const getFollowingUsers = async (req) => {
  const result = { data: null };
  const payload = req.decoded;

  try {
    // Find the user by their ID
    const user = await appUsersSchema.findById(payload.id);

    if (!user) {
      result.code = 2017; // User not found
      return result;
    }

    // Extract blocked users data
    const followingUsers = user.following;

    // Fetch detailed information for each blocked user
    const detailedFollowingUsers = [];
    for (const followingUserId of followingUsers) {
      const userData = await appUsersSchema.findById(followingUserId);

      if (userData) {
        detailedFollowingUsers.push({
          _id: userData._id,
          email: userData.email,
          full_name: userData.full_name,
          name: userData.name,
          profileImg: userData.profileImg,
          profileCover: userData.profileCover,
          username: userData.username,
          city: userData.city,
          country: userData.country,
          date_of_birth: userData.date_of_birth,
          gender: userData.gender,
          verified: userData.verified,
        });
      }
    }

    if (detailedFollowingUsers.length > 0) {
      result.data = detailedFollowingUsers;
      result.code = 200; // Success
    } else {
      result.code = 204; // No content
    }
  } catch (error) {
    console.error("Error:", error);
    result.code = 500; // Internal Server Error
    result.message = "Error processing the request";
  }

  return result;
};

const getFollowerUsers = async (req) => {
  const result = { data: null };
  const payload = req.decoded;

  try {
    // Find the user by their ID
    const user = await appUsersSchema.findById(payload.id);

    if (!user) {
      result.code = 2017; // User not found
      return result;
    }

    // Extract blocked users data
    const followerUsers = user.followers;

    // Fetch detailed information for each blocked user
    const detailedFollowerUsers = [];
    for (const followerUserId of followerUsers) {
      const userData = await appUsersSchema.findById(followerUserId);

      if (userData) {
        detailedFollowerUsers.push({
          _id: userData._id,
          email: userData.email,
          full_name: userData.full_name,
          name: userData.name,
          profileImg: userData.profileImg,
          profileCover: userData.profileCover,
          username: userData.username,
          city: userData.city,
          country: userData.country,
          date_of_birth: userData.date_of_birth,
          gender: userData.gender,
          verified: userData.verified,
        });
      }
    }

    if (detailedFollowerUsers.length > 0) {
      result.data = detailedFollowerUsers;
      result.code = 200; // Success
    } else {
      result.code = 204; // No content
    }
  } catch (error) {
    console.error("Error:", error);
    result.code = 500; // Internal Server Error
    result.message = "Error processing the request";
  }

  return result;
};

module.exports = {
  login,
  registerAppUser,
  updateappUser,
  deleteappUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  profileCoverImage,
  getappUserProfile,
  uploadGalleryImage,
  deleteGalleryImage,
  checkUsername,
  removeProfileCoverImage,
  uploadProfileCoverImage,
  bulkUserUpload,
  addRemoveBlockUser,
  getBlockedUsers,
  addRemoveFollowUser,
  getFollowingUsers,
  getFollowerUsers,
};
