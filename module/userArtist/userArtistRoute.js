const userArtistController = require("./userArtistController");
const middleware = require("../../middleware");

module.exports = (router) => {
  router.post(
    "/artist/login",
    middleware.validateToken,
    userArtistController.artistLogin
  );
  router.post("/loginUser", userArtistController.artistLogin);
  router.post(
    "/user-artist/forgot-password",
    userArtistController.forgotPassword
  );
  router.post(
    "/user-artist/reset-password",
    userArtistController.resetPassword
  );
  router.post(
    "/user-artist/verification-code",
    userArtistController.verificationCode
  );
  // router.post(
  //   "/artist/reset-password",
  //   middleware.validateToken,
  //   userArtistController.forgotPasswordArtist
  // );
  router.post(
    "/add/UserArtist",
    middleware.validateToken,
    userArtistController.addUserArtist
  );
  router.post("/registerUser", userArtistController.addUserArtist);
  router.post(
    "/update/UserArtistSpecificColumn",
    middleware.validateToken,
    userArtistController.updateUserArtistSpecificColumn
  );
  router.put(
    "/update/UserArtist",
    middleware.validateToken,
    userArtistController.updateUserArtist
  );
  router.get(
    "/all/UserArtist",
    middleware.validateToken,
    userArtistController.getAllUserArtist
  );
  router.get(
    "/UserArtist/:id",
    middleware.validateToken,
    userArtistController.getUserArtist
  );
  router.post(
    "/remove/UserArtist/:id",
    middleware.validateToken,
    userArtistController.deleteUserArtist
  );
};
