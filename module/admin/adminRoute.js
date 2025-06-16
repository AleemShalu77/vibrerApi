const adminController = require("./adminController");
const { uploader } = require("../../utils/fileUploader");

module.exports = (router) => {
  // Auth routes
  router.post("/login", adminController.login);
  router.post("/forgot-password", adminController.forgotPassword);
  router.post("/reset-password", adminController.resetPassword);
  router.post("/verify-code", adminController.verificationCode);

  // Admin management
  router.post(
    "/admin/add",
    uploader.single("profileImage"),
    adminController.addUser
  );

  router.post(
    "/admin/update",
    uploader.single("profileImage"),
    adminController.updateUser
  );

  router.get("/admin/all", adminController.getAllUser);
  router.get("/admin/:id", adminController.getUser);
  router.post("/admin/remove/:id", adminController.deleteUser);
};
