const platformCommissionController = require("./platformCommissionController");

module.exports = router => {
  router.post("/add/PlatformCommission", platformCommissionController.addPlatformCommission);
  router.put("/update/PlatformCommission", platformCommissionController.updatePlatformCommission);
  router.get("/all/PlatformCommission", platformCommissionController.getAllPlatformCommission);
  router.get("/PlatformCommission/:id", platformCommissionController.getPlatformCommission);
  router.post("/remove/PlatformCommission/:id", platformCommissionController.deletePlatformCommission);
}