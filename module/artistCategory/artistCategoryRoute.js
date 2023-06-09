const artistCategoryController = require("./artistCategoryController");

module.exports = router => {
  router.post("/add/artist-category", artistCategoryController.addartistCategory);
  router.put("/update/artist-category",  artistCategoryController.updateartistCategory);
  router.get("/all/artist-category", artistCategoryController.getAllartistCategory);
  router.get("/artist-category/:id", artistCategoryController.getartistCategory);
  router.post("/remove/artist-category/:id", artistCategoryController.deleteartistCategory);
}