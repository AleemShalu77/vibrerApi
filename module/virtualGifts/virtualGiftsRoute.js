const virtualGiftsController = require("./virtualGiftsController");
const { uploader } = require("../../utils/fileUploader");

module.exports = router => {
  router.post("/add/VirtualGift", uploader.single('icon_img'), virtualGiftsController.addVirtualGift);
  router.put("/update/VirtualGift", virtualGiftsController.updateVirtualGift);
  router.get("/all/VirtualGift", virtualGiftsController.getAllVirtualGift);
  router.get("/VirtualGift/:id", virtualGiftsController.getVirtualGift);
  router.post("/remove/VirtualGift/:id", virtualGiftsController.deleteVirtualGift);
}
