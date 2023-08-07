const contestController = require("./contestController");
const middleware = require("../../middleware")

module.exports = router => {
  //contest
  router.post("/add/contest", middleware.validateToken, contestController.addContest);
  router.put("/update/contest", middleware.validateToken, contestController.updateContest);
  router.post("/all/contest", middleware.validateToken, contestController.getAllContest);
  router.get("/contest/:id", middleware.validateToken, contestController.getContest);
  router.post("/remove/contest/:id", middleware.validateToken, contestController.deleteContest);
}