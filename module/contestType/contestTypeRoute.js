const typeController = require("./contestTypeController");
const tokenValidator = require("../../middleware/index");

module.exports = (router) => {
  router.post(
    "/contest-type/add",
    tokenValidator.validateToken,
    typeController.addtype
  );
  router.put(
    "/contest-type/update",
    tokenValidator.validateToken,
    typeController.updatetype
  );
  router.get(
    "/contest-type/all",
    tokenValidator.validateToken,
    typeController.getAlltype
  );
  router.get(
    "/contest-type/:id",
    tokenValidator.validateToken,
    typeController.gettype
  );
  router.post(
    "/contest-type/remove/:id",
    tokenValidator.validateToken,
    typeController.deletetype
  );
};
