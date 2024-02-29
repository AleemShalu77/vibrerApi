const contestController = require("./contestController");
const middleware = require("../../middleware");

module.exports = (router) => {
  //contest
  router.post(
    "/add/contest",
    middleware.validateToken,
    contestController.addContest
  );
  router.put(
    "/update/contest",
    middleware.validateToken,
    contestController.updateContest
  );
  router.post("/all/contest", contestController.getAllContest);
  router.get("/contest/:id", contestController.getContest);
  router.get(
    "/contest-details/:id",
    middleware.validateToken,
    contestController.getContest
  );
  router.post(
    "/remove/contest/:id",
    middleware.validateToken,
    contestController.deleteContest
  );

  router.get(
    "/contest-single-entry/:contestId/:entryId",
    contestController.getSingleEntry
  );
  router.get(
    "/contest-single-entry/:contestId",
    contestController.getSingleEntry
  );
  router.get("/contest-single-entry", contestController.getSingleEntry);
};
