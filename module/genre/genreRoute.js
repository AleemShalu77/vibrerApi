const genreController = require("./genreController");

module.exports = router => {
  router.post("/add/genre", genreController.addGenre);
  router.put("/update/genre",  genreController.updateGenre);
  router.get("/all/genre", genreController.getAllGenre);
  router.get("/genre/:id", genreController.getGenre);
  router.post("/remove/genre/:id", genreController.deleteGenre);
}