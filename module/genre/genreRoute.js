const genreController = require("./genreController");
const tokenValidator = require("../../middleware/index");

module.exports = (router) => {
  router.post(
    "/add/genre",
    tokenValidator.validateToken,
    genreController.addGenre
  );
  router.put(
    "/update/genre",
    tokenValidator.validateToken,
    genreController.updateGenre
  );
  router.get("/all/genre", genreController.getAllGenre);
  router.get(
    "/genre/:id",
    tokenValidator.validateToken,
    genreController.getGenre
  );
  router.post(
    "/remove/genre/:id",
    tokenValidator.validateToken,
    genreController.deleteGenre
  );
};
