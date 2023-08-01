const typeController = require("./typeController");
const tokenValidator = require("../../middleware/index");


module.exports = router => {
  router.post("/add/type", tokenValidator.validateToken, typeController.addtype);
  router.put("/update/type", tokenValidator.validateToken,  typeController.updatetype);
  router.get("/all/type", tokenValidator.validateToken, typeController.getAlltype);
  router.get("/type/:id", tokenValidator.validateToken, typeController.gettype);
  router.post("/remove/type/:id", tokenValidator.validateToken, typeController.deletetype);
}