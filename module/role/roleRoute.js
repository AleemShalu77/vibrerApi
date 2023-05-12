const roleController = require("./roleController");

module.exports = router => {
  router.post("/add/Role", roleController.addRole);
  router.put("/update/Role", roleController.updateRole);
  router.get("/all/Role", roleController.getAllRole);
  router.get("/Role/:id", roleController.getRole);
  router.post("/remove/Role/:id", roleController.deleteRole);
}