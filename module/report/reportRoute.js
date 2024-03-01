const reportController = require("./reportController");
const tokenValidator = require("../../middleware/index");

module.exports = (router) => {
  router.post(
    "/entry/submitReport",
    tokenValidator.validateToken,
    reportController.submitReport
  );
};
