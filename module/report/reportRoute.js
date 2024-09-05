const reportController = require("./reportController");
const tokenValidator = require("../../middleware/index");

module.exports = (router) => {
  router.post(
    "/entry/submitReport",
    tokenValidator.validateToken,
    reportController.submitReport
  );

  router.get(
    "/entry/getReports",
    tokenValidator.validateToken,
    reportController.getReports
  );

  router.get(
    "/entry/reported",
    tokenValidator.validateToken,
    reportController.entryReported
  );
  router.get(
    "/entry/report-view/:report_id",
    tokenValidator.validateToken,
    reportController.reportView
  );
};
