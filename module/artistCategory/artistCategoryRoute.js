const artistCategoryController = require("./artistCategoryController");
const { uploader } = require("../../utils/fileUploader");

module.exports = router => {
  router.post("/add/artist-category", uploader.single('icon_img'), artistCategoryController.addartistCategory);
  router.put("/update/artist-category", uploader.single('icon_img'), artistCategoryController.updateartistCategory);
  router.get("/all/artist-category", artistCategoryController.getAllartistCategory);
  router.get("/artist-category/:id", artistCategoryController.getartistCategory);
  router.post("/remove/artist-category/:id", artistCategoryController.deleteartistCategory);
}