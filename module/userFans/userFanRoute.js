const userfanController = require("./userFanController");

module.exports = router => {
    router.post("/fan/login", userfanController.fanLogin);
    router.post("/fan/reset-password", userfanController.forgotPasswordfan);
    router.post("/add/Userfan", userfanController.addUserfan);
    router.put("/update/Userfan", userfanController.updateUserfan);
    router.get("/all/Userfan", userfanController.getAllUserfan);
    router.get("/Userfan/:id", userfanController.getUserfan);
    router.post("/remove/Userfan/:id", userfanController.deleteUserfan);
}