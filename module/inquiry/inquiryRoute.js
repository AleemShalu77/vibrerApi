const inquiryController = require("./inquiryController");
const tokenValidator = require("../../middleware/index");

module.exports = (router) => {
  router.post("/add/inquiry", inquiryController.addInquiry);
  router.get("/all/inquiry", inquiryController.getAllInquiries);
  router.get("/inquiry/:id", inquiryController.getInquiry);
  router.post("/remove/inquiry/:id", inquiryController.deleteInquiry);
};
