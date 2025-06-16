const contestController = require("./contestController");
const middleware = require("../../middleware");

module.exports = (router) => {
  //contest
  router.post(
    "/contest/add",
    middleware.validateToken,
    contestController.addContest
  );
  router.put(
    "/contest/update",
    middleware.validateToken,
    contestController.updateContest
  );
  router.post("/contest/all", contestController.getAllContest);
  router.get("/contest/:id", contestController.getContest);
  router.get(
    "/contest/details/:id",
    middleware.validateToken,
    contestController.getContest
  );
  router.post(
    "/contest/remove/:id",
    middleware.validateToken,
    contestController.deleteContest
  );

  router.post("/contest/entries/:id", contestController.getContestEntries);
  router.post(
    "/contest/entries/auth/:id",
    middleware.validateToken,
    contestController.getContestEntries
  );

  router.get(
    "/contest/entry/:contestId/:entryId",
    contestController.getSingleEntry
  );

  router.get(
    "/contest/user-entry/:contestId",
    middleware.validateToken,
    contestController.getUserEntry
  );
};
