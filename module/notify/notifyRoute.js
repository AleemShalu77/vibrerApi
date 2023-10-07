const notifyController = require("./notifyController");

module.exports = (router) => {
  router.post("/api/v1/notify", notifyController.addToNotifyList);
};
