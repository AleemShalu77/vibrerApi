const appUserController = require("./appUserController");
const middleware = require("../../middleware");
const { uploader } = require("../../utils/fileUploader");

module.exports = (router) => {
  router.post("/app-user/register", appUserController.registerAppUser);
  router.post("/app-user/login", appUserController.login);
  router.post("/app-user/forgot-password", appUserController.forgotPassword);
  router.post("/app-user/reset-password", appUserController.resetPassword);
  router.post("/app-user/verify-email", appUserController.verifyEmail);
  router.post(
    "/app-user/check/username",
    middleware.validateToken,
    appUserController.checkUsername
  );
  router.patch(
    "/app-user/update",
    middleware.validateToken,
    appUserController.updateappUser
  );
  router.get(
    "/app-user/profile",
    middleware.validateToken,
    appUserController.getappUserProfile
  );
  router.post(
    "/app-user/delete-account",
    middleware.validateToken,
    appUserController.deleteappUser
  );
  router.post(
    "/app-user/upload/profile-cover-image",
    middleware.validateToken,
    uploader.single("profile_cover_image"),
    appUserController.profileCoverImage
  );
  router.post(
    "/app-user/remove/profile-cover-image",
    middleware.validateToken,
    appUserController.removeProfileCoverImage
  );
  router.post(
    "/app-user/upload/gallery-image",
    middleware.validateToken,
    uploader.single("gallery_img"),
    appUserController.uploadGalleryImage
  );

  router.post(
    "/app-user/remove/gallery-image/:id",
    middleware.validateToken,
    appUserController.deleteGalleryImage
  );
};
