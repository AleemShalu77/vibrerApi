const notifySchema = require("../../model/notifyModel");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const geoip = require("geoip-lite");
require("dotenv").config();

const addToNotifyList = async (req, res) => {
  const result = { data: null };
  try {
    // Get the client's IP address (this can be more complex depending on your setup)
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    //console.log("Captured IP:", ip); // Debug line

    // Get the geo-information based on IP address
    const geo = geoip.lookup(ip);
    //console.log("Geo information:", geo); // Debug line

    // Modify the request body to include geo-information
    const requestBodyWithGeo = {
      ...req.body,
      country: geo ? geo.country : "Unknown",
      city: geo ? geo.city : "Unknown",
    };

    // Create new notification with country and city
    const newNotification = await notifySchema.create(requestBodyWithGeo);

    // Read the email template
    const emailTemplatePath = path.join(
      __dirname,
      "../../",
      "emails",
      "subscriberEmailFirst.html"
    );
    let emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");
    emailTemplate = emailTemplate.replace(
      "[firstName & lastName]",
      `${req.body.firstName} ${req.body.lastName}`
    );

    //console.log("Email Template:", emailTemplate); // Debug line

    emailTemplate = emailTemplate.replace(
      "[firstName & lastName]",
      `${req.body.firstName} ${req.body.lastName}`
    );
    emailTemplate = emailTemplate.replace(
      "[firstName]",
      `${req.body.firstName}`
    );

    // Email setup
    const transporter = nodemailer.createTransport({
      host: "smtp.ionos.com",
      port: 587,
      secure: false,
      requireTLS: true, // Force the use of TLS
      auth: {
        user: process.env.EMAIL_FROM, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });

    // Send the email
    await transporter.sendMail({
      from: '"Vibrer" <subscriptions@vibrer.app>',
      to: req.body.email,
      subject: "Welcome to Our Mailing List",
      html: emailTemplate,
    });

    (result.data = {
      notification: newNotification,
    }),
      (result.code = 201);
  } catch (err) {
    console.log("Error:", err);

    let errors = {};
    if (err.code === 11000) {
      // Duplicate email error
      errors.email = "Email already exists";
    } else if (err && err.errors) {
      // Validation errors
      errors = Object.keys(err.errors).reduce((acc, key) => {
        acc[key] = err.errors[key].message;
        return acc;
      }, {});
    } else {
      // Some other error
      errors.generic = "An error occurred";
    }

    result.code = 400;
    result.data = errors;
  }

  return result;
};

module.exports = {
  addToNotifyList,
};
