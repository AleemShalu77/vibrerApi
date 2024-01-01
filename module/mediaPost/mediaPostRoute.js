const mediaPostController = require("./mediaPostController");
const middleware = require("../../middleware");
const { videoUploader } = require("../../utils/videoUploader");

module.exports = (router) => {
  router.post(
    "/add/MediaPost",
    middleware.validateToken,
    videoUploader.single("media_video"),
    mediaPostController.addMediaPost
  );
  router.post(
    "/add/contestParticipateVote",
    middleware.validateToken,
    mediaPostController.contestParticipateVote
  );
  router.post(
    "/remove/MediaPost/:id",
    middleware.validateToken,
    mediaPostController.deleteMediaPost
  );
  // router.put("/update/MediaPost", mediaPostController.updateMediaPost);
  // router.get("/all/MediaPost", mediaPostController.getAllMediaPost);
  // router.get("/MediaPost/:id", mediaPostController.getMediaPost);
  // router.post("/remove/MediaPost/:id", mediaPostController.deleteMediaPost);
};
