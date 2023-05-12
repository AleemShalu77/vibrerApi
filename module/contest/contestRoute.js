const contestController = require("./contestController");

module.exports = router => {

  //constest-type
  router.post("/add/contest-type", uploader.single('icon_img'), contestController.addContestType);
  router.put("/update/contest-type", contestController.updateContestType);
  router.get("/all/contest-type", contestController.getAllContestType);
  router.get("/contest-type/:id", contestController.getContestType);
  router.post("/remove/contest-type/:id", contestController.deleteContestType);

  //contest
  router.post("/add/contest", contestController.addContest);
  router.put("/update/contest", contestController.updateContest);
  router.get("/all/contest", contestController.getAllContest);
  router.get("/contest/:id", contestController.getContest);
  router.post("/remove/contest/:id", contestController.deleteContest);
}