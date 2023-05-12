const contestService = require('./contestService');
const helper = require("../../utils/helper");
const createHttpError = require('http-errors');
const { validateAddContestTypeReq, validateUpdateContestTypeReq, validateAddContestReq, validateUpdateContestReq } = require("./contestValidation");

const addContestType = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateAddContestTypeReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await contestService.addContestType(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const updateContestType = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateUpdateContestTypeReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await contestService.updateContestType(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const getAllContestType = async (req, res, next) => {
  try {
    let result = await contestService.getAllContestType(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const getContestType = async (req, res, next) => {
  try {
    let result = await contestService.getContestType(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const deleteContestType = async (req, res, next) => {
  try {
    let result = await contestService.deleteContestType(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const addContest = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateAddContestReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await contestService.addContest(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const updateContest = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateUpdateContestReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await contestService.updateContest(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const getAllContest = async (req, res, next) => {
  try {
    let result = await contestService.getAllContest(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const getContest = async (req, res, next) => {
  try {
    let result = await contestService.getContest(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const deleteContest = async (req, res, next) => {
  try {
    let result = await contestService.deleteContest(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

module.exports = {
  addContestType,
  updateContestType,
  getAllContestType,
  getContestType,
  deleteContestType,
  addContest,
  updateContest,
  getAllContest,
  getContest,
  deleteContest
}