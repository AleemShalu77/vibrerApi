const concertService = require("./concertService");
const helper = require("../../utils/helper");
const createHttpError = require("http-errors");
const {
  validateAddConcertReq,
  validateUpdateConcertReq,
} = require("./concertValidation");

const addConcert = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateAddConcertReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await concertService.addConcert(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const updateConcert = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateUpdateConcertReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await concertService.updateConcert(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const getAllConcert = async (req, res, next) => {
  try {
    let result = await concertService.getAllConcert(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const getConcert = async (req, res, next) => {
  try {
    let result = await concertService.getConcert(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const deleteConcert = async (req, res, next) => {
  try {
    let result = await concertService.deleteConcert(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addConcert,
  updateConcert,
  getAllConcert,
  getConcert,
  deleteConcert,
};
