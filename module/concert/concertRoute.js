const concertController = require("./concertController");

module.exports = router => {
  router.post("/add/concert",  concertController.addConcertType);
  router.put("/update/concert", concertController.updateConcertType);
  router.get("/all/concert", concertController.getAllConcertType);
  router.get("/concert/:id", concertController.getConcertType);
  router.post("/remove/concert/:id", concertController.deleteConcertType);
}
