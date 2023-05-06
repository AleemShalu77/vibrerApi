const concertController = require("./concertController");
const {uploader}= require("../../utils/fileUploader");

module.exports = router =>{
    router.post("/add/concert",uploader.single('icon_img'), concertController.addConcertType);
    router.put("/update/concert", concertController.updateConcertType);
    router.get("/all/concert", concertController.getAllConcertType);
    router.get("/concert/:id", concertController.getConcertType);
    router.post("/remove/concert/:id", concertController.deleteConcertType);
  }
