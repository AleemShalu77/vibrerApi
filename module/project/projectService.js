const projectSchema = require("../../model/postProject");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const addProjectApplicant = async (req) => {
  const result = { data: null };
  const { projectId } = req.params;
  const newApplicant = req.body;

  // Check if the project exists
  const projectDetails = await projectSchema.findById(projectId);
  if (!projectDetails) {
    result.code = 2026;
    return result;
  }

  try {
    await projectSchema.updateOne(
      { _id: projectId },
      {
        $push: { applicants: newApplicant },
      },
      { runValidators: true }
    );

    // Read the email template
    const emailTemplatePath = path.join(
      __dirname,
      "../../",
      "emails",
      "applProjectEmail.html"
    );
    let emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");
    emailTemplate = emailTemplate.replace(
      "[firstName & lastName]",
      `${newApplicant.firstName} ${newApplicant.lastName}`
    );

    // Replace other placeholders
    emailTemplate = emailTemplate.replace(
      "[Singer]",
      projectDetails.requirements.ArtistType
    );
    emailTemplate = emailTemplate.replace(
      "[projectLink]",
      `https://vibrer.app/project-view/${projectId}`
    );

    // Set up transporter and send email
    const transporter = nodemailer.createTransport({
      host: "smtp.ionos.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_FROM, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });

    await transporter.sendMail({
      from: '"Vibrer" <subscriptions@vibrer.app>',
      to: req.body.email,
      subject: "Application Received",
      html: emailTemplate,
    });

    result.code = 2027;
  } catch (error) {
    console.log(error);
    result.code = 2028;
  }
  return result;
};

// Existing getProjects function
const getProjects = async (req, res) => {
  const result = { data: null };
  try {
    const projects = await projectSchema.find();
    result.data = projects;
    result.code = 200;
  } catch (err) {
    console.error(err);
    result.code = 204;
  }
  return result;
};

const viewProject = async (req, res) => {
  const result = { data: null };
  try {
    const project = await projectSchema.findById(req.params.id);
    if (!project) {
      result.code = 204;
    }
    result.data = project;
    result.code = 200;
  } catch (err) {
    // console.log(err);
    result.code = 2028;
  }
  return result;
};

module.exports = {
  addProjectApplicant,
  getProjects,
  viewProject,
};
