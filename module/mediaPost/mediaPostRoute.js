const mediaPostController = require("./mediaPostController");
const middleware = require("../../middleware");
const { videoUploader } = require("../../utils/videoUploader");

module.exports = (router) => {
  router.post(
    "/contest/entry/add",
    middleware.validateToken,
    mediaPostController.addMediaPost
  );
  router.post(
    "/contest/entry/media/upload",
    middleware.validateToken,
    videoUploader.single("media_video"),
    mediaPostController.uploadMediaVideo
  );
  router.post(
    "/contest/entry/remove/:id",
    middleware.validateToken,
    mediaPostController.deleteMediaPost
  );
  router.post(
    "/contest/entry/vote/add",
    middleware.validateToken,
    mediaPostController.contestParticipateVote
  );
  router.get(
    "/contest/entry/vote",
    middleware.validateToken,
    mediaPostController.getVotedContestParticipants
  );
  router.post(
    "/contest/entry/favourite/add",
    middleware.validateToken,
    mediaPostController.addToFavourite
  );
  router.get(
    "/contest/entry/favourite",
    middleware.validateToken,
    mediaPostController.getAllFavouriteContestParticipants
  );

  router.get(
    "/contest/entry/user",
    middleware.validateToken,
    mediaPostController.getUserParticipatedContests
  );
  router.put(
    "/contest/entry/status/update",
    middleware.validateToken,
    mediaPostController.updateMediaPostStatus
  );

  router.put(
    "/update/least-quality",
    middleware.validateToken,
    mediaPostController.updateLeastQuality
  );
};
