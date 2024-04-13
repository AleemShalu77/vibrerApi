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
// Configure multer for multiple file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure the AWS SDK to use Cloudflare R2
const s3 = new AWS.S3({
  endpoint: END_POINT,
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  signatureVersion: "v4",
  region: "auto", // Cloudflare R2 does not require a specific region
  s3ForcePathStyle: true, // This forces the request to use path-style addressing
});

module.exports = (router) => {
  router.post(
    "/upload/r2BulkUpload",
    upload.array("videos"),
    async (req, res) => {
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).send("No files were uploaded.");
      }

      // Upload files to Cloudflare R2
      const uploadPromises = files.map((file) => {
        const params = {
          Bucket: MEDIA_BUCKET_NAME,
          Key: `${file.originalname}`,
          Body: file.buffer,
        };
        return s3.upload(params).promise();
      });

      try {
        await Promise.all(uploadPromises);
        res.send("Files uploaded successfully.");
      } catch (error) {
        console.error("Upload error:", error);
        res.status(500).send("Error uploading files.");
      }
    }
  );
};
