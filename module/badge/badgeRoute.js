const badgeController = require("./badgeController");
const { uploader } = require("../../utils/fileUploader");
const middleware = require("../../middleware")

module.exports = router => {
  router.post("/add/badge", middleware.validateToken, badgeController.addBadge);
  router.put("/update/badge", middleware.validateToken, middleware.validateToken, badgeController.updateBadge);
  router.get("/all/badge", middleware.validateToken, badgeController.getAllBadge);
  router.get("/badge/:id", middleware.validateToken, badgeController.getBadge);
  router.post("/remove/badge/:id", middleware.validateToken, badgeController.deleteBadge);
}