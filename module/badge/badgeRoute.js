const badgeController = require("./badgeController");
const { uploader } = require("../../utils/fileUploader");
const middleware = require("../../middleware/")

module.exports = router => {
  router.post("/add/badge", uploader.single('icon_img'), badgeController.addBadge);
  router.put("/update/badge", badgeController.updateBadge);
  router.get("/all/badge", badgeController.getAllBadge);
  router.get("/badge/:id", badgeController.getBadge);
  router.post("/remove/badge/:id", badgeController.deleteBadge);
}