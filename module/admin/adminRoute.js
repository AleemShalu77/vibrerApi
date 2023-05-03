const adminController = require("./adminController");
const {uploader}= require("../../utils/fileUploader");

module.exports = router =>{
    // router.post("/login", adminController.login);
    router.post("/add/admin",uploader.single('profile_img'), adminController.addUser);
    router.put("/update/admin", adminController.updateUser);
    router.get("/all/user", adminController.getAllUser);
    router.get("/user", adminController.getUser);
    router.post("/remove/user", adminController.deleteUser);
  }