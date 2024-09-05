const inquiryService = require("./inquiryService");
const helper = require("../../utils/helper");
const createHttpError = require("http-errors");
const { validateAddInquiryReq } = require("./inquiryValidation");

const addInquiry = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateAddInquiryReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await inquiryService.addInquiry(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const getAllInquiries = async (req, res, next) => {
  try {
    let result = await inquiryService.getAllInquiries(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const getInquiry = async (req, res, next) => {
  try {
    if (
      !req.params.id ||
      Object.keys(req.params).length === 0 ||
      req.params.id == "undefined"
    ) {
      return next(createHttpError(400, { message: "Please pass id" }));
    }
    let result = await inquiryService.getInquiry(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const deleteInquiry = async (req, res, next) => {
  try {
    if (
      !req.params.id ||
      Object.keys(req.params).length === 0 ||
      req.params.id == "undefined"
    ) {
      return next(createHttpError(400, { message: "Please pass id" }));
    }
    let result = await inquiryService.deleteInquiry(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addInquiry,
  getAllInquiries,
  getInquiry,
  deleteInquiry,
};
