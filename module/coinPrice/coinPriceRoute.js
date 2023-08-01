const coinPriceController = require("./coinPriceController");
const middleware = require("../../middleware")

module.exports = router => {
  router.post("/add/coinPrice", middleware.validateToken, coinPriceController.addCoinPrice);
  router.put("/update/coinPrice", middleware.validateToken, coinPriceController.updateCoinPrice);
  router.get("/all/coinPrice", middleware.validateToken, coinPriceController.getAllCoinPrice);
  router.get("/coinPrice/:id", middleware.validateToken, coinPriceController.getCoinPrice);
  router.post("/remove/coinPrice/:id", middleware.validateToken, coinPriceController.deleteCoinPrice);
}
