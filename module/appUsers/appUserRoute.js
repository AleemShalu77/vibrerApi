const appUserController = require("./appUserController");
const middleware = require("../../middleware");
const { uploader } = require("../../utils/fileUploader");

module.exports = (router) => {
  router.post(
    "/artist/login",
    middleware.validateToken,
    appUserController.artistLogin
  );
  router.post("/loginUser", appUserController.artistLogin);
  router.post("/appUser/forgot-password", appUserController.forgotPassword);
  router.post("/appUser/reset-password", appUserController.resetPassword);
  router.post("/appUser/verification-code", appUserController.verificationCode);
  // router.post(
  //   "/artist/reset-password",
  //   middleware.validateToken,
  //   appUserController.forgotPasswordArtist
  // );
  router.post(
    "/add/appUser",
    middleware.validateToken,
    appUserController.addappUser
  );
  router.post("/registerUser", appUserController.registerappUser);
  router.post(
    "/update/appUserSpecificColumn",
    middleware.validateToken,
    appUserController.updateappUserSpecificColumn
  );
  router.patch(
    "/update/appUser",
    middleware.validateToken,
    appUserController.updateappUser
  );
  router.get(
    "/all/appUser",
    middleware.validateToken,
    appUserController.getAllappUser
  );
  router.get(
    "/appUser/:id",
    middleware.validateToken,
    appUserController.getappUser
  );
  router.get(
    "/getappUserProfile",
    middleware.validateToken,
    appUserController.getappUserProfile
  );
  router.post(
    "/remove/appUser/:id",
    middleware.validateToken,
    appUserController.deleteappUser
  );
  router.post(
    "/upload/profile-cover-image",
    middleware.validateToken,
    uploader.single("profile_cover_image"),
    appUserController.profileCoverImage
  );
  router.post(
    "/upload/gallery-image",
    middleware.validateToken,
    uploader.single("gallery_img"),
    appUserController.uploadGalleryImage
  );

  router.post(
    "/remove/gallery-image/:id",
    middleware.validateToken,
    appUserController.deleteGalleryImage
  );
  router.post(
    "/remove/profile-cover-image",
    middleware.validateToken,
    appUserController.removeProfileCoverImage
  );
  router.post(
    "/check/username",
    middleware.validateToken,
    appUserController.checkUsername
  );
};
