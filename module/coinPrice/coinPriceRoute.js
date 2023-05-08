const coinPriceController = require("./coinPriceController");
const {uploader}= require("../../utils/fileUploader");

module.exports = router =>{
    router.post("/add/coinPrice",uploader.single('icon_img'), coinPriceController.addCoinPrice);
    router.put("/update/coinPrice", coinPriceController.updateCoinPrice);
    router.get("/all/coinPrice", coinPriceController.getAllCoinPrice);
    router.get("/coinPrice/:id", coinPriceController.getCoinPrice);
    router.post("/remove/coinPrice/:id", coinPriceController.deleteCoinPrice);
  }
