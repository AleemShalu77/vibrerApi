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
    "/addContestParticipantToFavourite",
    middleware.validateToken,
    mediaPostController.addToFavourite
  );
  router.get(
    "/getAllFavouriteContestParticipants",
    middleware.validateToken,
    mediaPostController.getAllFavouriteContestParticipants
  );
  router.get(
    "/getVotedContestParticipants",
    middleware.validateToken,
    mediaPostController.getVotedContestParticipants
  );
  router.get(
    "/getUserParticipatedContests",
    middleware.validateToken,
    mediaPostController.getUserParticipatedContests
  );
  router.post(
    "/remove/MediaPost/:id",
    middleware.validateToken,
    mediaPostController.deleteMediaPost
  );
  router.put(
    "/update/MediaPostStatus",
    mediaPostController.updateMediaPostStatus
  );

  router.get(
    "/count/adminDashboardCount",
    middleware.validateToken,
    mediaPostController.adminDashboardCount
  );
  router.put(
    "/update/least-quality",
    middleware.validateToken,
    mediaPostController.updateLeastQuality
  );
  // router.get("/all/MediaPost", mediaPostController.getAllMediaPost);
  // router.get("/MediaPost/:id", mediaPostController.getMediaPost);
  // router.post("/remove/MediaPost/:id", mediaPostController.deleteMediaPost);
};
