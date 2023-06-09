const artistStatusController = require("./artistStatusController");

module.exports = router => {
  router.post("/add/artist-status", artistStatusController.addArtistStatus);
  router.put("/update/artist-status", artistStatusController.updateArtistStatus);
  router.get("/all/artist-status", artistStatusController.getAllArtistStatus);
  router.get("/artist-status/:id", artistStatusController.getArtistStatus);
  router.post("/remove/artist-status/:id", artistStatusController.deleteArtistStatus);
}

