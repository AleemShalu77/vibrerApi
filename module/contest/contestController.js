const contestService = require("./contestService");
const helper = require("../../utils/helper");
const createHttpError = require("http-errors");
const {
  validateAddContestReq,
  validateUpdateContestReq,
} = require("./contestValidation");

const addContest = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateAddContestReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await contestService.addContest(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const updateContest = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateUpdateContestReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await contestService.updateContest(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const getAllContest = async (req, res, next) => {
  try {
    let result = await contestService.getAllContest(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const getContest = async (req, res, next) => {
  try {
    let result = await contestService.getContest(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const deleteContest = async (req, res, next) => {
  try {
    let result = await contestService.deleteContest(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const getSingleEntry = async (req, res, next) => {
  try {
    let result = await contestService.getSingleEntry(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addContest,
  updateContest,
  getAllContest,
  getContest,
  deleteContest,
  getSingleEntry,
};
