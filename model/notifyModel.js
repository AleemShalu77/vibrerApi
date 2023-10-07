const mongoose = require("mongoose");

const notifySchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    mailType: {
      type: String,
      required: [true, "Mail type is required"],
    },
    country: {
      type: String,
      default: "Unknown", // You can set default value as per your need
    },
    city: {
      type: String,
      default: "Unknown", // You can set default value as per your need
    },
  },
  {
    timestamps: true, // Enable timestamps
  }
);

const Notify = mongoose.model("Notify", notifySchema, "mailing_list");

module.exports = Notify;
