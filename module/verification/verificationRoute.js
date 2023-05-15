const verificationController = require("./verificationController");

module.exports = router => {
  router.post("/add/Verification", verificationController.addVerification);
  router.put("/update/Verification", verificationController.updateVerification);
  router.get("/all/Verification", verificationController.getAllVerification);
  router.get("/Verification/:id", verificationController.getVerification);
  router.post("/remove/Verification/:id", verificationController.deleteVerification);
}