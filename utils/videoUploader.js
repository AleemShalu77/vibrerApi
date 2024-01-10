var multer = require("multer");
var path = require("path");
const createHttpError = require("http-errors");

const video_dir = path.join(__dirname, "../public/mediaVideo"); // Add a directory for video uploads

const allowed_video_formats = [
  ".mp4",
  ".avi",
  ".mov",
  ".mkv",
  ".webm",
  ".m4v",
  ".flv",
]; // Add more video formats as needed

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dirname = video_dir;

    // Handle different paths for different file types
    if (req.path === "/add/MediaPost") {
      dirname = video_dir;
    }

    cb(null, dirname);
  },

  filename: (req, file, cb) => {
    let filename =
      file.fieldname + "_" + Date.now() + path.extname(file.originalname);
    filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  // Check the file format based on the path
  let allowed_formats = [];
  if (req.path === "/add/MediaPost") {
    allowed_formats = allowed_video_formats;
  }

  if (allowed_formats.includes(path.extname(file.originalname))) {
    cb(null, true);
  } else {
    return cb(
      createHttpError(400, {
        message: "Only " + allowed_formats.join(", ") + " are allowed",
      })
    );
  }
};

const videoUploader = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = {
  videoUploader,
};
