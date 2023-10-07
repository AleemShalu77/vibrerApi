const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: "Title is required" },
    description: { type: String, required: "Description is required" },
    mediaUrl: { type: String, required: "Media URL is required" },
    mediatype: { type: String, required: "Media type is required" },
    requirements: {
      ProjectType: String,
      ArtistType: String,
      Gender: String,
      Country: String,
      Language: String,
      message: String,
    },
    projectStatus: { type: String, default: "active" },
    status: { type: String, default: "active" },
    banner: String,
    applicants: [
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
          // Removed unique constraint
        },
        phone: {
          type: String,
          required: [true, "Phone is required"],
        },
        city: {
          type: String,
          required: [true, "City is required"],
        },
        country: String,
        link: {
          type: String,
          required: [true, "Link is required"],
        },
        message: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
