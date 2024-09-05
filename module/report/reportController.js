const reportService = require("./reportService");
const helper = require("../../utils/helper");
const createHttpError = require("http-errors");
const {
  validateSubmitReportReq,
  validateGetReports,
  validateEntryReported,
} = require("./reportValidation");

const submitReport = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateSubmitReportReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await reportService.submitReport(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    let isValid = await validateGetReports.validateAsync(req.query);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await reportService.getReports(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const entryReported = async (req, res, next) => {
  try {
    let isValid = await validateEntryReported.validateAsync(req.query);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await reportService.entryReported(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const reportView = async (req, res, next) => {
  try {
    let result = await reportService.reportView(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitReport,
  getReports,
  entryReported,
  reportView,
};
