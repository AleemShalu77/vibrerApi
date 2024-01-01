const artistCategoryController = require("./artistCategoryController");
const tokenValidator = require("../../middleware/index");

module.exports = (router) => {
  router.post(
    "/add/artist-category",
    tokenValidator.validateToken,
    artistCategoryController.addartistCategory
  );
  router.put(
    "/update/artist-category",
    tokenValidator.validateToken,
    artistCategoryController.updateartistCategory
  );
  router.get(
    "/all/artist-category",
    artistCategoryController.getAllartistCategory
  );
  router.get(
    "/artist-category/:id",
    tokenValidator.validateToken,
    artistCategoryController.getartistCategory
  );
  router.post(
    "/remove/artist-category/:id",
    tokenValidator.validateToken,
    artistCategoryController.deleteartistCategory
  );
};
