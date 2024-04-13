const multer = require("multer");
const AWS = require("aws-sdk");
const stream = require("stream");
const {
  PROFILE_COVER_URL,
  GALLERY_IMAGE_URL,
  MEDIA_VIDEO_URL,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  END_POINT,
  MEDIA_BUCKET_NAME,
} = require("../../config/index");
require("dotenv").config();

const s3 = new AWS.S3({
  endpoint: END_POINT,
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  signatureVersion: "v4",
  region: "auto", // Cloudflare R2 does not require a specific region
  s3ForcePathStyle: true, // This forces the request to use path-style addressing
});

const upload = multer({ storage: multer.memoryStorage() });

module.exports = (router) => {
  router.post("/upload/r2Direct", upload.single("video"), (req, res) => {
    const file = req.file;

    const readStream = new stream.PassThrough();
    readStream.end(file.buffer);
    const params = {
      Bucket: MEDIA_BUCKET_NAME,
      Key: file.originalname,
      Body: readStream,
      ContentType: file.mimetype, // Important for the client to correctly handle the file
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error", err);
        res.status(500).send("Failed to upload");
      } else {
        console.log("Upload Success", data.Location);
        res.send("File uploaded successfully");
      }
    });
  });
};
