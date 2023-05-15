const concertService = require('./concertService');
const helper = require("../../utils/helper");
const createHttpError = require('http-errors');
const { validateAddConcertTypeReq, validateUpdateConcertTypeReq } = require("./concertValidation");

const addConcertType = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateAddConcertTypeReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await concertService.addConcertType(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const updateConcertType = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateUpdateConcertTypeReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await concertService.updateConcertType(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const getAllConcertType = async (req, res, next) => {
  try {
    let result = await concertService.getAllConcertType(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const getConcertType = async (req, res, next) => {
  try {
    let result = await concertService.getConcertType(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const deleteConcertType = async (req, res, next) => {
  try {
    let result = await concertService.deleteConcertType(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

module.exports = {
  addConcertType,
  updateConcertType,
  getAllConcertType,
  getConcertType,
  deleteConcertType
}