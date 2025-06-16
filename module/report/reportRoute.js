const reportController = require("./reportController");
const tokenValidator = require("../../middleware/index");

module.exports = (router) => {
  router.post(
    "/report/entry/submit",
    tokenValidator.validateToken,
    reportController.submitReport
  );

  router.get(
    "/report/entry",
    tokenValidator.validateToken,
    reportController.getReports
  );

  router.get(
    "/report/entry/reported",
    tokenValidator.validateToken,
    reportController.entryReported
  );
  router.get(
    "/report/entry/view/:report_id",
    tokenValidator.validateToken,
    reportController.reportView
  );
};
