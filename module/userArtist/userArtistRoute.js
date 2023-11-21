const userArtistController = require("./userArtistController");
const middleware = require("../../middleware");

module.exports = (router) => {
  router.post("/loginUser", userArtistController.artistLogin);
  router.post(
    "/artist/reset-password",
    middleware.validateToken,
    userArtistController.forgotPasswordArtist
  );
  router.post("/registerUser", userArtistController.addUserArtist);
  router.post(
    "/update/UserArtistSpecificColumn",
    middleware.validateToken,
    userArtistController.updateUserArtistSpecificColumn
  );
  router.put("/update/UserArtist", userArtistController.updateUserArtist);
  router.get(
    "/all/UserArtist",
    middleware.validateToken,
    userArtistController.getAllUserArtist
  );
  router.get("/UserArtist/:id", userArtistController.getUserArtist);
  router.post(
    "/remove/UserArtist/:id",
    middleware.validateToken,
    userArtistController.deleteUserArtist
  );
};
