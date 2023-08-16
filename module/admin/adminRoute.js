const adminController = require("./adminController");
const { uploader } = require("../../utils/fileUploader");

module.exports = router => {
  router.post("/login", adminController.login);
  router.post("/reset-password", adminController.forgotPassword);
  router.post("/verification-code", adminController.verificationCode);
  router.post("/add/admin", uploader.single('profile_img'), adminController.addUser);
  router.post("/update/admin", uploader.single('profile_img'), adminController.updateUser);
  router.get("/all/user", adminController.getAllUser);
  router.get("/user/:id", adminController.getUser);
  router.post("/remove/user/:id", adminController.deleteUser);
}