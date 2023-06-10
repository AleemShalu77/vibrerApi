const coinPriceController = require("./coinPriceController");
const { uploader } = require("../../utils/fileUploader");
const middleware = require("../../middleware")

module.exports = router => {
  router.post("/add/coinPrice", uploader.single('icon_img'), middleware.validateAuthToken(), coinPriceController.addCoinPrice);
  router.put("/update/coinPrice", uploader.single('icon_img'), middleware.validateAuthToken(), coinPriceController.updateCoinPrice);
  router.get("/all/coinPrice", coinPriceController.getAllCoinPrice);
  router.get("/coinPrice/:id", coinPriceController.getCoinPrice);
  router.post("/remove/coinPrice/:id", coinPriceController.deleteCoinPrice);
}
