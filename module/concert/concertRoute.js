const concertController = require("./concertController");
const middleware = require("../../middleware");

module.exports = (router) => {
  router.post(
    "/add/concert",
    middleware.validateToken,
    concertController.addConcert
  );
  router.post(
    "/update/concert",
    middleware.validateToken,
    concertController.updateConcert
  );
  router.post(
    "/all/concert",
    middleware.validateToken,
    concertController.getAllConcert
  );
  router.get(
    "/concert/:id",
    middleware.validateToken,
    concertController.getConcert
  );
  router.post(
    "/remove/concert/:id",
    middleware.validateToken,
    concertController.deleteConcert
  );
};
