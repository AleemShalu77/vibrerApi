const contestController = require("./contestController");

module.exports = router =>{
    router.post("/add/contest-type",uploader.single('icon_img'), contestController.addContestType);
    router.put("/update/contest-type", contestController.updateContestType);
    router.get("/all/contest-type", contestController.getAllContestType);
    router.get("/contest-type", contestController.getContestType);
    router.post("/remove/contest-type", contestController.deleteContestType);
  }
