const mediaPostController = require("./mediaPostController");

module.exports = router => {
  router.post("/add/MediaPost", mediaPostController.addMediaPost);
  router.put("/update/MediaPost", mediaPostController.updateMediaPost);
  router.get("/all/MediaPost", mediaPostController.getAllMediaPost);
  router.get("/MediaPost/:id", mediaPostController.getMediaPost);
  router.post("/remove/MediaPost/:id", mediaPostController.deleteMediaPost);
}
