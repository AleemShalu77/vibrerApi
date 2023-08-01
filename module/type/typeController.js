const typeService = require('./typeService');
const helper = require("../../utils/helper");
const createHttpError = require('http-errors');
const { validateAddtypeReq, validateUpdatetypeReq } = require("./typeValidation");

const addtype = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateAddtypeReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await typeService.addtype(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const updatetype = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateUpdatetypeReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await typeService.updatetype(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const getAlltype = async (req, res, next) => {
  try {
    let result = await typeService.getAlltype(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const gettype = async (req, res, next) => {
  try {
    if (!req.params.id || (Object.keys(req.params).length) === 0 || req.params.id == "undefined") {
      return next(createHttpError(400, { message: 'Please pass id' }));
    }
    let result = await typeService.gettype(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const deletetype = async (req, res, next) => {
  try {
    if (!req.params.id || (Object.keys(req.params).length) === 0 || req.params.id == "undefined") {
      return next(createHttpError(400, { message: 'Please pass id' }));
    }
    let result = await typeService.deletetype(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

module.exports = {
  addtype,
  updatetype,
  getAlltype,
  gettype,
  deletetype
}