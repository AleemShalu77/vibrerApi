const adminUsersSchema = require("../../model/admin_users");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const { ADMIN_IMAGE_URL } = require("../../config/index");
const nodemailer = require("nodemailer");
require("dotenv").config();
const {
  getMessage,
  getForgotPassword,
  generateRandomToken,
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

passport.use(
  "local-signup-admin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        // Check if email already exists
        const adminCheck = await adminUsersSchema.findOne({ email });
        if (adminCheck) {
          return done(null, false, { message: "Email is already taken." });
        }

        // Check if file is uploaded
        if (!req.file || !req.file.filename) {
          return done(null, false, { message: "Profile image is required." });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = generateRandomToken(50);

        // Create new user
        const user = await adminUsersSchema.create({
          name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
          },
          role: req.body.role,
          email,
          password: hashedPassword,
          isVerified: false,
          verificationToken,
          profileImage: `${ADMIN_IMAGE_URL}${req.file.filename}`,
          createdBy: req.body.createdBy,
          updatedBy: req.body.updatedBy,
          status: req.body.status,
        });

        // Send verification email
        const message = await getEmailVerification(email, verificationToken);
        const messageData = await getMessage(
          message,
          email,
          process.env.EMAIL_FROM,
          "Vibrer Email Verification"
        );
        await transporter.sendMail(messageData);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "local-login-admin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await adminUsersSchema.findOne({
          email: email,
          isVerified: true,
        });

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

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await adminUsersSchema.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const login = async (req) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local-login-admin", (err, user, info) => {
      let result = { data: null };

      if (err) {
        reject(err);
      } else if (!user) {
        result.code = 2019; // Invalid email or password
        resolve(result);
      } else {
        let payload = {
          id: user.id,
          email: user.email,
          role: user.role,
        };

        let options = { expiresIn: "72h" };
        let token = jwt.sign(payload, JWT_SECRET, options);

        let resObj = {
          role: user.role,
          email: user.email,
          verification: user.verification,
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

  try {
    const admin = await adminUsersSchema.findOne({ email: email });

    if (admin) {
      try {
        // await sendGridMail.send(messageData);
        const verification_token = generateRandomToken(50);
        const message = await getForgotPassword(admin.name, verification_token);
        const messageData = await getMessage(
          message,
          email,
          process.env.EMAIL_FROM,
          "Forgot Password"
        );
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
    const admin = await adminUsersSchema.findOne({
      "forgotPasswordToken.token": token,
    });

    if (admin) {
      const currentTimestamp = new Date();
      if (admin.forgotPasswordToken.expiresAt < currentTimestamp) {
        result.code = 2018; // Token has expired
      } else {
        const reset = await adminUsersSchema.updateOne(
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
    const adminUser = await adminUsersSchema.findOne({
      verificationToken: token,
      isVerified: false,
    });
    if (adminUser) {
      const updateToken = await adminUsersSchema.updateOne(
        { _id: adminUser._id },
        { $set: { isVerified: true } }
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

// const addUser = (req, res, next) => {
//   passport.authenticate("local-signup-admin", (err, user, info) => {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.status(400).json({ code: 204, message: info.message });
//     }
//     req.logIn(user, (err) => {
//       if (err) {
//         return next(err);
//       }
//       return res.status(201).json({ code: 201, data: user });
//     });
//   })(req, res, next);
// };

const updateUser = async (req) => {
  const result = { data: null };
  const { id, firstName, lastName, role, email, password, isVerified, status } =
    req.body;

  const filter = { _id: id };

  // Check if email already exists for another user
  const existingUser = await adminUsersSchema.findOne({
    email: email,
    _id: { $ne: id },
  });
  if (existingUser) {
    result.code = 205;
    return result;
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const updateData = {
    name: {
      firstName: firstName,
      lastName: lastName,
    },
    role: role,
    email: email,
    isVerified: isVerified,
    password: hashedPassword,
    status: status,
  };

  // Conditionally include profileImg only if file is uploaded
  if (req.file && req.file.filename) {
    updateData.profileImage = `${ADMIN_IMAGE_URL}${req.file.filename}`;
  }

  const user = await adminUsersSchema.updateOne(filter, updateData);

  if (user.modifiedCount > 0) {
    result.data = user;
    result.code = 202;
  } else {
    result.code = 204;
  }
  return result;
};

const getAllUser = async (req) => {
  const result = { data: null };
  const user = await adminUsersSchema.find();
  if (user) {
    result.data = user;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
};

const getUser = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const user = await adminUsersSchema.findById(id);
  if (user) {
    result.data = user;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
};

const deleteUser = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const user = await adminUsersSchema.findByIdAndRemove(id);
  if (user) {
    result.data = user;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  verificationCode,
  // addUser,
  updateUser,
  getAllUser,
  getUser,
  deleteUser,
};
